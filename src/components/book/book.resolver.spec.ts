import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AuthorService } from '../author/author.service';
import { Author } from '../author/entities/author.entity';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { User } from '../users/entities/user.entity';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { GetBooksArgs } from './dto/get-books-args.input';
import { Book } from './entities/book.entity';
import { UserActivityLogEntity } from '../user-activity-log/entities/user-activity-log.entity';
import { UserActivityLogService } from '../user-activity-log/user-activity-log.service';
import {
  DYNAMODB_CLIENT,
  DynamoDBClientModule,
} from '../aws/dynamodb/aws-dynamodb.module';

describe('BookResolver', () => {
  let resolver: BookResolver;
  let bookService: BookService;
  let bookRepositoryMock: Repository<Book>;
  let userRepositoryMock: Repository<User>;
  let authorRepositoryMock: Repository<Author>;
  let roleRepositoryMock: Repository<Role>;
  let dataSourceMock: DataSource;
  const userActivityLogEntityRepositoryMock =
    {} as Repository<UserActivityLogEntity>;
  const DynamoDBClientModuleMock = {} as DynamoDBClientModule;

  const cacheManagerMock = {
    get: jest.fn(),
    set: jest.fn(),
  } as unknown as Cache;

  beforeEach(async () => {
    authorRepositoryMock = {} as unknown as Repository<Author>;
    bookRepositoryMock = {} as unknown as Repository<Book>;
    userRepositoryMock = {} as unknown as Repository<User>;
    roleRepositoryMock = {} as unknown as Repository<Role>;
    dataSourceMock = {} as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookResolver,
        BookService,
        AuthorService,
        RoleService,
        UserActivityLogService,
        {
          provide: getRepositoryToken(Book),
          useValue: bookRepositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: roleRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserActivityLogEntity),
          useValue: roleRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserActivityLogEntity),
          useValue: userActivityLogEntityRepositoryMock,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: authorRepositoryMock,
        },
        {
          provide: DYNAMODB_CLIENT,
          useValue: DynamoDBClientModuleMock,
        },
        {
          provide: '__UserActivityLogEntityDynamoDBModel__',
          useValue: DynamoDBClientModuleMock,
        },
      ],
    }).compile();

    resolver = module.get<BookResolver>(BookResolver);
    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('books query', () => {
    it('should return a list of books', async () => {
      const getBooksArgs = new GetBooksArgs();
      const expectedBooks = [new Book(), new Book()];

      jest.spyOn(bookService, 'findAll').mockResolvedValue(expectedBooks);

      const result = await resolver.books(getBooksArgs);

      expect(result).toEqual(expectedBooks);
    });
  });

  describe('book query', () => {
    it('should return a book by id', async () => {
      const book = new Book();
      const id = 1;

      jest.spyOn(bookService, 'findOne').mockResolvedValue(book);

      const result = await resolver.book(id);

      expect(result).toEqual(book);
    });
  });

  describe('createBook mutation', () => {
    it('should create a book', async () => {
      const createBookInput = {
        title: 'Title',
        publishedAt: new Date(),
        authors: [],
      };
      const book = new Book();

      jest.spyOn(bookService, 'create').mockResolvedValue(book);

      const result = await resolver.createBook({}, createBookInput);

      expect(result).toEqual(book);
    });
  });

  describe('updateBook mutation', () => {
    it('should update a book', async () => {
      const updateBookInput = {
        id: 1,
        title: 'Title',
        publishedAt: new Date(),
        authors: [],
      };
      const book = new Book();

      jest.spyOn(bookService, 'update').mockResolvedValue(book);

      const result = await resolver.updateBook(updateBookInput);

      expect(result).toEqual(book);
    });
  });

  describe('removeBook mutation', () => {
    it('should remove a book', async () => {
      const id = 1;

      jest.spyOn(bookService, 'remove').mockResolvedValue('Book removed');

      const result = await resolver.removeBook(id);

      expect(result).toEqual('Book removed');
    });
  });
});
