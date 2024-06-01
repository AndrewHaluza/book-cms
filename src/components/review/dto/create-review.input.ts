import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { reviewLimits } from '../constants/limits';
import { Field, InputType } from '@nestjs/graphql';

@InputType('createReviewInput')
export class CreateReviewInput {
  @IsNumber()
  @IsPositive()
  @Field()
  bookId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(reviewLimits.message.max)
  @MinLength(reviewLimits.message.min)
  @Field()
  message: string;

  @IsNumber()
  @Max(reviewLimits.rating.max)
  @Min(reviewLimits.rating.min)
  @Field()
  rating: number;

  @IsDate()
  @Field()
  publishedAt: Date;
}
