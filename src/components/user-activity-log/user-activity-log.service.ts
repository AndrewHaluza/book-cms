import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from 'nestjs-dynamodb';

import { createCacheKey } from '../../helpers/cache-key';
import { unwrapDynamoDbResult } from '../../helpers/unwrap-dynamodb-result';
import { DYNAMODB_CLIENT } from '../aws/dynamodb/aws-dynamodb.module';
import { CreateUserActivityLogInput } from './dto/create-user-activity-log.input';
import {
  UserActivityLog,
  UserActivityLogEntity,
} from './entities/user-activity-log.entity';

@Injectable()
export class UserActivityLogService {
  constructor(
    @InjectModel(UserActivityLogEntity)
    private readonly userActivityLogEntityRepository: typeof UserActivityLog,
    @Inject(DYNAMODB_CLIENT) private dynamoDBClient: DynamoDBClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    userId: number,
    input: CreateUserActivityLogInput,
  ): Promise<UserActivityLogEntity> {
    const userActivityLogSaveData = {
      ...input,
      sk: Date.now().toString(),
      pk: userId.toString(),
    };
    const userActivityLog = await this.userActivityLogEntityRepository.create(
      userActivityLogSaveData,
    );

    return userActivityLog;
  }

  async findOne(
    userId: number,
    timestamp: string,
  ): Promise<UserActivityLogEntity> {
    const cacheKey = createCacheKey('user-activity-log', { userId, timestamp });
    const cachedData =
      await this.cacheManager.get<UserActivityLogEntity>(cacheKey);

    if (cachedData) return cachedData;

    const userActivityLog = await this.userActivityLogEntityRepository.find({
      pk: userId.toString(),
      sk: timestamp,
    });

    await this.cacheManager.set(cacheKey, userActivityLog);

    return userActivityLog;
  }

  async find(userId: number) {
    // this.userActivityLogEntityRepository.query is bugged in dependency, so was needed to use the DynamoDBClient directly;

    const params: QueryCommandInput = {
      TableName: 'user-activity-log',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: userId.toString() },
      },
    };

    const cacheKey = createCacheKey('user-activity-logs', params);
    const cachedData =
      await this.cacheManager.get<UserActivityLogEntity[]>(cacheKey);

    if (cachedData) return cachedData;

    const command = new QueryCommand(params);

    try {
      const response = await this.dynamoDBClient.send(command);
      const logs = unwrapDynamoDbResult<UserActivityLogEntity>(response.Items);

      await this.cacheManager.set(cacheKey, logs);

      return logs;
    } catch (error) {
      throw error;
    }
  }
}
