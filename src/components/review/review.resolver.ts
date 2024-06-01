import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { graphqlDescription } from '../../helpers/gql-description';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { SessionUser } from '../users/dto/session-user.dto';
import { CreateReviewInput } from './dto/create-review.input';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';

@Resolver('ReviewResolver')
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [ReviewEntity], {
    description: graphqlDescription('Get user reviews', {}),
  })
  async findByUser(@Args('userId', { type: () => Number }) userId: number) {
    return await this.reviewService.findByUser(userId);
  }

  @Mutation(() => ReviewEntity)
  @UseGuards(GqlAuthGuard)
  async createReview(
    @CurrentUser() { id }: SessionUser,
    @Args('createReviewInput')
    createReviewInput: CreateReviewInput,
  ) {
    return await this.reviewService.create(id, createReviewInput);
  }
}
