import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { graphqlDescription } from '../../helpers/gql-description';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ROLES } from '../role/constants/roles';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { BookService } from './book.service';
import { CreateBookInput } from './dto/create-book.input';
import { GetBooksArgs } from './dto/get-books-args.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => Book, {
    description: graphqlDescription('Create a new book', {
      roles: [ROLES.admin, ROLES.moderator],
    }),
  })
  @Roles([ROLES.admin, ROLES.moderator])
  @UseGuards(GqlAuthGuard, RoleGuard)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.create(createBookInput);
  }

  @Query(() => [Book], {
    description: graphqlDescription('Get books list', {}),
  })
  async books(@Args('getBooksArgs') getBooksArgs: GetBooksArgs) {
    return await this.bookService.findAll(getBooksArgs);
  }

  @Query(() => Book, {
    description: graphqlDescription('Get book by ID', {}),
  })
  book(@Args('id') id: number) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book, {
    description: graphqlDescription('Update a book', {
      roles: [ROLES.admin, ROLES.moderator],
    }),
  })
  @Roles([ROLES.admin, ROLES.moderator])
  @UseGuards(GqlAuthGuard, RoleGuard)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => String, {
    description: graphqlDescription('Remove a book', {
      roles: [ROLES.admin],
    }),
  })
  @Roles([ROLES.admin])
  @UseGuards(GqlAuthGuard, RoleGuard)
  removeBook(@Args('id') id: number) {
    return this.bookService.remove(id);
  }
}
