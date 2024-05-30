import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { GetBookPaginationArgs } from './dto/get-book-pagination-args.input';
import { Book } from './entities/book.entity';
import { DeleteResult } from 'typeorm';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => Book, { name: 'createBook' })
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.create(createBookInput);
  }

  @Query(() => [Book])
  async books(@Args('pagination') pagination: GetBookPaginationArgs) {
    return await this.bookService.findAll(pagination);
  }

  @Query(() => [Book])
  async booksSearch(@Args('pagination') pagination: GetBookPaginationArgs) {
    return await this.bookService.findAll(pagination);
  }

  @Query(() => Book, { name: 'book' })
  book(@Args('id') id: number) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book, { name: 'updateBook' })
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => String)
  removeBook(@Args('id') id: number) {
    return this.bookService.remove(id);
  }
}
