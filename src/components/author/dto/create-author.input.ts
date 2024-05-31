import { Field, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { authorLimits } from '../constants/limits';
import { Author } from '../entities/author.entity';

@InputType('createAuthorInput')
export class CreateAuthorInput implements Partial<Author> {
  @Field({ nullable: true })
  id?: number;

  @Field()
  @IsString()
  @MaxLength(authorLimits.fullName.max)
  @MinLength(authorLimits.fullName.min)
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsDateString()
  birthDate: string;
}
