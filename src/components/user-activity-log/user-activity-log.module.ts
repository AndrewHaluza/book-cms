import { Module } from '@nestjs/common';
import { DynamoDBModule } from 'nestjs-dynamodb';

import { UserActivityLogService } from './user-activity-log.service';
import { UserActivityLogEntity } from './entities/user-activity-log.entity';
import { UserActivityLogResolver } from './user-activity-log.resolver';
import { DynamoDBClientModule } from '../aws/dynamodb/aws-dynamodb.module';

@Module({
  imports: [
    DynamoDBModule.forFeature([UserActivityLogEntity]),
    DynamoDBClientModule,
  ],
  controllers: [],
  providers: [UserActivityLogResolver, UserActivityLogService],
  exports: [UserActivityLogService],
})
export class UserActivityLogModule {}
