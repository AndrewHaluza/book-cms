import { Test, TestingModule } from '@nestjs/testing';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorService } from '../author/author.service';
import { User } from '../users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Author } from '../author/entities/author.entity';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

describe('BookResolver', () => {
  let resolver: BookResolver;
  let bookRepositoryMock: Repository<Book>;
  let userRepositoryMock: Repository<User>;
  let authorRepositoryMock: Repository<Author>;
  let roleRepositoryMock: Repository<Role>;
  let dataSourceMock: DataSource;
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
      ],
    }).compile();

    resolver = module.get<BookResolver>(BookResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
