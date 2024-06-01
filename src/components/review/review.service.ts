import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-dynamodb';

import { CreateReviewInput } from './dto/create-review.input';
import { Review, ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewEntity) private readonly reviewRepository: typeof Review,
  ) {}

  async create(input: CreateReviewInput): Promise<ReviewEntity> {
    return this.reviewRepository.create(input);
  }
}
