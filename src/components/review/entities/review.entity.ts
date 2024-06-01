import { Field, ObjectType } from '@nestjs/graphql';
import {
  Attribute,
  HashKey,
  RangeKey,
  ReturnModel,
  Table,
} from 'nestjs-dynamodb';

@Table('review')
@ObjectType()
export class ReviewEntity {
  @Field({ nullable: false })
  @HashKey({})
  pk: string; // `BOOK_ID#${bookId}`

  @Field({ nullable: false })
  @RangeKey()
  sk: string; // `USER_ID#${userId}`

  @Field()
  @Attribute()
  message: string;

  @Field()
  @Attribute()
  rating: number;

  @Field()
  @Attribute()
  publishedAt: number;
}

export const Review = ReturnModel<ReviewEntity>();
