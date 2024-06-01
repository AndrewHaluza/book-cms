import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('createUserActivityLogInput')
export class CreateUserActivityLogInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  activityType: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  details: string;
}
