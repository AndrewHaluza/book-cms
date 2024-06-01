import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { graphqlDescription } from '../../helpers/gql-description';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ROLES } from '../role/constants/roles';
import { SessionUser } from '../users/dto/session-user.dto';
import { CreateUserActivityLogInput } from './dto/create-user-activity-log.input';
import { UserActivityLogEntity } from './entities/user-activity-log.entity';
import { UserActivityLogService } from './user-activity-log.service';

@Resolver('UserActivityLogResolver')
export class UserActivityLogResolver {
  constructor(
    private readonly userActivityLogService: UserActivityLogService,
  ) {}

  @Query(() => UserActivityLogEntity, {
    description: graphqlDescription('Get specific user activity log', {
      roles: [ROLES.admin, ROLES.moderator, ROLES.user],
    }),
  })
  @UseGuards(GqlAuthGuard)
  async userActivityLog(
    @Args('timestamp', { type: () => String }) timestamp: string,
    @CurrentUser() user,
  ) {
    return await this.userActivityLogService.findOne(user.id, timestamp);
  }

  @Query(() => [UserActivityLogEntity], {
    description: graphqlDescription('Get user activity logs', {
      roles: [ROLES.admin, ROLES.moderator, ROLES.user],
    }),
  })
  @UseGuards(GqlAuthGuard)
  async userActivityLogs(@CurrentUser() user) {
    return await this.userActivityLogService.find(user.id);
  }

  @Mutation(() => UserActivityLogEntity)
  @UseGuards(GqlAuthGuard)
  async createUserActivityLog(
    @CurrentUser() { id }: SessionUser,
    @Args('createUserActivityLogInput')
    createUserActivityLogInput: CreateUserActivityLogInput,
  ) {
    return await this.userActivityLogService.create(
      id,
      createUserActivityLogInput,
    );
  }
}
