import { Module } from '@nestjs/common';
import { DynamoDBModule } from 'nestjs-dynamodb';

import { DynamoDBClientModule } from '../aws/dynamodb/aws-dynamodb.module';
import { ReviewEntity } from './entities/review.entity';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';

@Module({
  imports: [DynamoDBModule.forFeature([ReviewEntity]), DynamoDBClientModule],
  controllers: [],
  providers: [ReviewResolver, ReviewService],
})
export class ReviewModule {}
