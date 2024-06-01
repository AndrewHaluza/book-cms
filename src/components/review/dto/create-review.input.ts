import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { reviewLimits } from '../constants/limits';

export class CreateReviewInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(reviewLimits.message.max)
  @MinLength(reviewLimits.message.min)
  message: string;

  @IsNumber()
  @Max(reviewLimits.rating.max)
  @Min(reviewLimits.rating.min)
  rating: number;

  @IsDate()
  publishedAt: Date;
}
