import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CreateAuthorInput } from 'src/components/author/dto/create-author.input';

@InputType('createBookInput')
export class CreateBookInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsDate()
  @Field()
  publishedAt: Date;

  @IsArray()
  @Field(() => [CreateAuthorInput]!)
  authors: CreateAuthorInput[];
}
