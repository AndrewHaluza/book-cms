import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsDateString } from 'class-validator';
import { Author } from '../entities/author.entity';

@InputType('createAuthorInput')
export class CreateAuthorInput implements Partial<Author> {
  @Field({ nullable: true })
  id: number;

  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsDateString()
  birthDate: string;
}
