import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

import { CreateBookInput } from './create-book.input';

@InputType('updateBookInput')
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field()
  @IsNumber()
  @IsPositive()
  id: number;
}
