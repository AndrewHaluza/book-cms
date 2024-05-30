import { Field, InputType, PartialType } from '@nestjs/graphql';

import { PaginationArgs } from '../../../dto/pagination-args.input';

@InputType()
export class GetBookPaginationArgs extends PartialType(PaginationArgs) {
  @Field(() => String, { nullable: true })
  search?: string;
}
