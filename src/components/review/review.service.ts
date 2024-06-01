import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-dynamodb';
import { Cache } from 'cache-manager';

import { createCacheKey } from '../../helpers/cache-key';
import { DYNAMODB_CLIENT } from '../aws/dynamodb/aws-dynamodb.module';
import { CreateReviewInput } from './dto/create-review.input';
import { Review, ReviewEntity } from './entities/review.entity';
import { unwrapDynamoDbResult } from 'src/helpers/unwrap-dynamodb-result';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewEntity) private readonly reviewRepository: typeof Review,
    @Inject(DYNAMODB_CLIENT) private dynamoDBClient: DynamoDBClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    userId: number,
    input: CreateReviewInput,
  ): Promise<ReviewEntity> {
    const reviewSaveData = {
      pk: `USER_ID#${userId}`,
      sk: `BOOK_ID#${input.bookId}`,
      message: input.message,
      rating: input.rating,
      publishedAt: Date.now(),
    };

    return this.reviewRepository.create(reviewSaveData);
  }

  async findByUser(userId: number): Promise<ReviewEntity[]> {
    // this.userActivityLogEntityRepository.query is bugged in dependency, so was needed to use the DynamoDBClient directly;

    const params: QueryCommandInput = {
      TableName: 'review',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `USER_ID#${userId}` },
      },
    };

    const cacheKey = createCacheKey('reviews', params);
    const cachedData = await this.cacheManager.get<ReviewEntity[]>(cacheKey);

    if (cachedData) return cachedData;

    const command = new QueryCommand(params);

    try {
      const response = await this.dynamoDBClient.send(command);
      const logs = unwrapDynamoDbResult<ReviewEntity>(response.Items);

      await this.cacheManager.set(cacheKey, logs);

      return logs;
    } catch (error) {
      throw error;
    }
  }
}
