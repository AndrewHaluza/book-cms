import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';
import { AuthorService } from '../author/author.service';
import { GetBooksArgs } from './dto/get-books-args.input';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private authorService: AuthorService,
    private connection: DataSource,
  ) {}

  async create(createBookInput: CreateBookInput) {
    try {
      const book = await this.connection.transaction(
        async (transactionalEntityManager) => {
          const authors =
            await this.authorService.findOrCreateAuthorsTransactionExecutor(
              createBookInput.authors,
              transactionalEntityManager,
            );

          const saveBookData = { ...createBookInput, authors };
          const bookModel = await this.bookRepository.create(saveBookData);
          const savedBook = await transactionalEntityManager.save(bookModel);

          return savedBook;
        },
      );

      return book;
    } catch (error) {
      throw error;
    }
  }

  async findAll(getBooksArgs: GetBooksArgs) {
    try {
      let books = [];

      if (getBooksArgs.search) {
        books = await this.#searchBooks(getBooksArgs);
      } else {
        books = await this.bookRepository.find({
          skip: getBooksArgs.offset,
          take: getBooksArgs.limit,
          order: {
            [getBooksArgs.sortField]: getBooksArgs.sortOrder,
          },
          relations: ['authors'],
        });
      }

      return books;
    } catch (error) {
      throw error;
    }
  }

  #searchBooks(pagination: GetBooksArgs) {
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .where(
        `to_tsvector('english', book.title) @@ plainto_tsquery('english', :searchTerm) OR
    to_tsvector('english', author.fullName) @@ plainto_tsquery('english', :searchTerm) OR
    EXTRACT(YEAR FROM book.publishedAt)::text LIKE :searchTerm`,
        { searchTerm: pagination.search },
      )
      .limit(pagination.limit)
      .offset(pagination.offset)
      .orderBy(`book.${pagination.sortField}`, pagination.sortOrder)
      .getMany();
  }

  async findOne(id: number) {
    try {
      const book = await this.bookRepository.findOneBy({ id });

      if (!book) {
        throw new BadRequestException('Book not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    try {
      const updateResult = await this.bookRepository.update(
        id,
        updateBookInput,
      );

      if (!updateResult.affected) {
        throw new BadRequestException('Book not found');
      }

      const updatedBook = await this.bookRepository.findOne({
        where: { id },
        relations: ['authors'],
      });

      return updatedBook;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.bookRepository.delete(id);

      if (!deleteResult.affected) {
        throw new BadRequestException('Book not found');
      } else {
        return 'Book deleted successfully';
      }
    } catch (error) {
      throw error;
    }
  }
}
