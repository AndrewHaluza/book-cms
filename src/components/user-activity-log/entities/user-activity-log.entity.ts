import { Field, ObjectType } from '@nestjs/graphql';
import {
  Attribute,
  HashKey,
  RangeKey,
  ReturnModel,
  Table,
} from 'nestjs-dynamodb';

@Table('user-activity-log')
@ObjectType()
export class UserActivityLogEntity {
  @Field({ nullable: false })
  @HashKey({})
  pk: string;

  @Field()
  @RangeKey()
  sk: string;

  @Field({})
  @Attribute({ defaultProvider: () => '' })
  activityType: string;

  @Attribute({ defaultProvider: () => '' })
  @Field({})
  details: string;
}

export const UserActivityLog = ReturnModel<UserActivityLogEntity>();
