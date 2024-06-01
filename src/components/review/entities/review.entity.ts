import { Attribute, HashKey, ReturnModel, Table } from 'nestjs-dynamodb';

@Table('review')
export class ReviewEntity {
  @HashKey({})
  pk: string;

  @Attribute()
  message: string;

  @Attribute()
  rating: number;

  @Attribute()
  userId: number;

  @Attribute()
  publishedAt: Date;
}

export const Review = ReturnModel<ReviewEntity>();
