import { Field, InputType, PartialType } from '@nestjs/graphql';

import { PaginationArgs } from '../../../dto/pagination-args.input';
import { graphqlDescription } from '../../../helpers/gql-description';

const sortOrderList = ['ASC', 'DESC'] as const;
const sortFieldList = ['id', 'title', 'publishedAt'] as const;

type SortOrder = (typeof sortOrderList)[number];
type SortField = (typeof sortFieldList)[number];

@InputType()
export class GetBooksArgs extends PartialType(PaginationArgs) {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => String, {
    defaultValue: 'id',
    description: graphqlDescription('Sort field', {
      values: Array.from(sortFieldList),
    }),
  })
  sortField?: SortField = 'id';

  @Field(() => String, {
    defaultValue: 'ASC',
    description: graphqlDescription('Sort order', {
      values: Array.from(sortOrderList),
    }),
  })
  sortOrder?: SortOrder = 'ASC';
}
