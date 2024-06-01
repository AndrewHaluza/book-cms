import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DataSource, Repository } from 'typeorm';

import { createCacheKey } from '../../helpers/cache-key';
import { AuthorService } from '../author/author.service';
import { UserActivityLogService } from '../user-activity-log/user-activity-log.service';
import { SessionUser } from '../users/dto/session-user.dto';
import { CreateBookInput } from './dto/create-book.input';
import { GetBooksArgs } from './dto/get-books-args.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private authorService: AuthorService,
    private connection: DataSource,
    private userActivityLogService: UserActivityLogService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(user: SessionUser, createBookInput: CreateBookInput) {
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

          const userActivityLogData = {
            activityType: 'book-create',
            details: `Book created with id: ${savedBook.id}`,
          };

          await this.userActivityLogService.create(
            user.id,
            userActivityLogData,
          );

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
      const cacheKey = createCacheKey('book', getBooksArgs);
      const cachedData = await this.cacheManager.get<Book>(cacheKey);

      if (cachedData) return cachedData;

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

      await this.cacheManager.set(cacheKey, books);

      return books;
    } catch (error) {
      throw error;
    }
  }

  #searchBooks(getBooksArgs: GetBooksArgs) {
    // get books by search term, using full-text search
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .where(
        `to_tsvector('english', book.title) @@ plainto_tsquery('english', :searchTerm) OR
    to_tsvector('english', author.fullName) @@ plainto_tsquery('english', :searchTerm) OR
    EXTRACT(YEAR FROM book.publishedAt)::text LIKE :searchTerm`,
        { searchTerm: getBooksArgs.search },
      )
      .limit(getBooksArgs.limit)
      .offset(getBooksArgs.offset)
      .orderBy(`book.${getBooksArgs.sortField}`, getBooksArgs.sortOrder)
      .getMany();
  }

  async findOne(id: number) {
    try {
      const cacheKey = `book-${id}`;
      const cachedData = await this.cacheManager.get<Book>(cacheKey);

      if (cachedData) return cachedData;

      const book = await this.bookRepository.findOneBy({ id });

      if (!book) {
        throw new BadRequestException('Book not found');
      }

      await this.cacheManager.set(cacheKey, book);

      return book;
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
