import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Cache } from 'cache-manager';

import { BookService } from './book.service';
import { AuthorService } from '../author/author.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { Author } from '../author/entities/author.entity';
import { UpdateBookInput } from './dto/update-book.input';
import { BadRequestException } from '@nestjs/common';

describe('BookService', () => {
  let bookRepositoryMock: Repository<Book>;
  let authorServiceMock: AuthorService;
  let connectionMock: DataSource;
  let cacheManagerMock: Cache;
  let bookService: BookService;

  beforeEach(() => {
    authorServiceMock = {
      findOrCreateAuthorsTransactionExecutor: jest.fn(),
    } as unknown as AuthorService;
    connectionMock = { transaction: jest.fn() } as unknown as DataSource;
    bookRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as unknown as Repository<Book>;
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as Cache;
    bookService = new BookService(
      bookRepositoryMock,
      authorServiceMock,
      connectionMock,
      cacheManagerMock,
    );
  });

  it('should create an instance of BookService', () => {
    expect(bookService).toBeInstanceOf(BookService);
    expect(bookService['bookRepository']).toBe(bookRepositoryMock);
    expect(bookService['authorService']).toBe(authorServiceMock);
    expect(bookService['connection']).toBe(connectionMock);
    expect(bookService['cacheManager']).toBe(cacheManagerMock);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all books', async () => {
      const books: Book[] = [
        {
          id: 1,
          title: 'et quia quis',
          publishedAt: new Date('1991-09-29T02:44:48.634Z'),
          authors: [],
        },
        {
          id: 2,
          title: 'voluptatem doloremque explicabo',
          publishedAt: new Date('1997-09-29T02:44:48.634Z'),
          authors: [],
        },
      ];

      jest.spyOn(cacheManagerMock, 'get').mockResolvedValueOnce(null);
      jest.spyOn(bookRepositoryMock, 'find').mockResolvedValueOnce(books);

      expect(await bookService.findAll({})).toEqual(books);
      expect(cacheManagerMock.get).toHaveBeenCalledWith('book-{}');
      expect(bookRepositoryMock.find).toHaveBeenCalled();
      expect(cacheManagerMock.set).toHaveBeenCalledWith(`book-{}`, books);
    });

    it('should return cached data', async () => {
      const books: Book[] = [
        {
          id: 1,
          title: 'et quia quis',
          publishedAt: new Date('1991-09-29T02:44:48.634Z'),
          authors: [],
        },
        {
          id: 2,
          title: 'voluptatem doloremque explicabo',
          publishedAt: new Date('1997-09-29T02:44:48.634Z'),
          authors: [],
        },
      ];

      jest.spyOn(cacheManagerMock, 'get').mockResolvedValueOnce(books);

      expect(await bookService.findAll({})).toEqual(books);
      expect(cacheManagerMock.get).toHaveBeenCalledWith('book-{}');
      expect(bookRepositoryMock.find).not.toHaveBeenCalled();
    });

    it('should return books with search', async () => {
      const books: Book[] = [
        {
          id: 2,
          title: 'voluptatem doloremque explicabo',
          publishedAt: new Date('1997-09-29T02:44:48.634Z'),
          authors: [],
        },
      ];
      const getBooksArgs = {
        search: 'voluptatem',
      };

      jest.spyOn(cacheManagerMock, 'get').mockResolvedValueOnce(null);
      jest.spyOn(bookRepositoryMock, 'createQueryBuilder').mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(books),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      } as any);

      expect(await bookService.findAll(getBooksArgs)).toEqual(books);
      expect(cacheManagerMock.get).toHaveBeenCalled();
      expect(bookRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create a book', async () => {
      const createBookInput: CreateBookInput = {
        title: 'New Book',
        publishedAt: new Date('2022-01-01T00:00:00.000Z'),
        authors: [
          {
            email: 'test1@email.com',
            fullName: 'Author 1',
            birthDate: '2022-01-01T00:00:00.000Z',
          },
          {
            email: 'test2@email.com',
            fullName: 'Author 2',
            birthDate: '2022-01-01T00:00:00.000Z',
          },
        ],
      };
      const authors: Author[] = [
        {
          id: 1,
          email: 'test1@email.com',
          fullName: 'Author 1',
          birthDate: '2022-01-01T00:00:00.000Z',
          books: [],
        },
        {
          id: 2,
          email: 'test2@email.com',
          fullName: 'Author 2',
          birthDate: '2022-01-01T00:00:00.000Z',
          books: [],
        },
      ];
      const book: Book = {
        id: 1,
        title: 'New Book',
        publishedAt: new Date('2022-01-01T00:00:00.000Z'),
        authors,
      };

      jest
        .spyOn(connectionMock, 'transaction')
        .mockReturnValue(Promise.resolve(book));

      expect(await bookService.create(createBookInput)).toEqual(book);
    });
  });

  describe('update()', () => {
    it('should update a book', async () => {
      const updateInput: UpdateBookInput = {
        id: 1,
        title: 'New Book',
        publishedAt: new Date('2022-01-01T00:00:00.000Z'),
        authors: [
          {
            email: 'test1@email.com',
            fullName: 'Author 1',
            birthDate: '2022-01-01T00:00:00.000Z',
          },
          {
            email: 'test2@email.com',
            fullName: 'Author 2',
            birthDate: '2022-01-01T00:00:00.000Z',
          },
        ],
      };

      jest
        .spyOn(bookRepositoryMock, 'update')
        .mockResolvedValueOnce({ affected: 1 } as unknown as UpdateResult);
      jest
        .spyOn(bookRepositoryMock, 'findOne')
        .mockResolvedValueOnce(updateInput as Book);

      expect(await bookService.update(updateInput.id, updateInput)).toEqual(
        updateInput,
      );
    });

    it('should throw an error if book not found', async () => {
      const updateInput: UpdateBookInput = {
        id: 1,
        title: 'New Book',
        publishedAt: new Date('2022-01-01T00:00:00.000Z'),
        authors: [],
      };

      jest
        .spyOn(bookRepositoryMock, 'update')
        .mockResolvedValueOnce({ affected: 0 } as unknown as UpdateResult);

      try {
        await bookService.update(updateInput.id, updateInput);
        fail('Expected BadRequestException not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Book not found');
      }
    });
  });

  describe('findOne()', () => {
    it('should return a book', async () => {
      const book: Book = {
        id: 1,
        title: 'New Book',
        publishedAt: new Date('2022-01-01T00:00:00.000Z'),
        authors: [],
      };

      jest.spyOn(cacheManagerMock, 'get').mockResolvedValueOnce(null);
      jest
        .spyOn(bookRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(book as unknown as Book);

      expect(await bookService.findOne(book.id)).toEqual(book);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(`book-${book.id}`);
      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        `book-${book.id}`,
        book,
      );
    });

    it('should return cached data', async () => {
      const book: Book = {
        id: 1,
        title: 'New Book',
        publishedAt: new Date('2022-01-01T00:00:00.000Z'),
        authors: [],
      };

      jest.spyOn(cacheManagerMock, 'get').mockResolvedValueOnce(book);

      expect(await bookService.findOne(book.id)).toEqual(book);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(`book-${book.id}`);
    });

    it('should throw an error if book not found', async () => {
      jest
        .spyOn(bookRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(undefined);

      try {
        await bookService.findOne(1);
        fail('Expected BadRequestException not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Book not found');
      }
    });
  });
});
