import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ROLES } from '../role/constants/roles';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthorService } from './author.service';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';

@Resolver('Author')
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => Author, {
    description: `Create an author, allowed for roles: ${ROLES.admin}, ${ROLES.moderator};`,
  })
  @Roles([ROLES.admin, ROLES.moderator])
  @UseGuards(GqlAuthGuard, RoleGuard)
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ) {
    return this.authorService.create(createAuthorInput);
  }

  @Query(() => Author)
  authors() {
    return this.authorService.findAll();
  }

  @Query(() => Author)
  author(@Args('id') id: number) {
    return this.authorService.findOne(id);
  }

  @Mutation(() => Author, {
    description: `Update an author, allowed for roles: ${ROLES.admin}, ${ROLES.moderator};`,
  })
  @Roles([ROLES.admin, ROLES.moderator])
  @UseGuards(GqlAuthGuard, RoleGuard)
  updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
  ) {
    return this.authorService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author, {
    description: `Remove an author, allowed for roles: ${ROLES.admin};`,
  })
  @Roles([ROLES.admin])
  @UseGuards(GqlAuthGuard, RoleGuard)
  removeAuthor(@Args('id') id: number) {
    return this.authorService.remove(id);
  }
}
