import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { CreateAuthorInput } from '../../author/dto/create-author.input';
import { bookLimits } from '../constants/limits';

@InputType('createBookInput')
export class CreateBookInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(bookLimits.title.max)
  @MinLength(bookLimits.title.min)
  @Field()
  title: string;

  @IsDate()
  @Field()
  publishedAt: Date;

  @IsArray()
  @Field(() => [CreateAuthorInput]!)
  authors: CreateAuthorInput[];
}
