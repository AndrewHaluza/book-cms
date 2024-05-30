import { CreateAuthorInput } from './create-author.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType('updateAuthorInput')
export class UpdateAuthorInput extends PartialType(CreateAuthorInput) {
  @Field()
  @IsNumber()
  @IsPositive()
  id: number;
}
