import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { graphqlDescription } from '../../helpers/gql-description';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ROLES } from '../role/constants/roles';
import { SessionUser } from './dto/session-user.dto';
import { UsersService } from './users.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => SessionUser, {
    description: graphqlDescription('Get current user session data', {
      roles: Object.values(ROLES),
    }),
  })
  @UseGuards(GqlAuthGuard)
  async getSessionUser(@CurrentUser() user: SessionUser) {
    return user;
  }
}
