import { Module } from '@nestjs/common';
import { DynamoDBModule } from 'nestjs-dynamodb';

import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';

@Module({
  imports: [DynamoDBModule.forFeature([ReviewEntity])],
  controllers: [],
  providers: [ReviewService],
})
export class ReviewModule {}
