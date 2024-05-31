import { Test, TestingModule } from '@nestjs/testing';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { Role } from '../role/entities/role.entity';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RoleService } from '../role/role.service';

describe('AuthorResolver', () => {
  let resolver: AuthorResolver;
  let roleRepositoryMock: Repository<Role>;
  let authorRepositoryMock: Repository<Author>;
  const cacheManagerMock = {
    get: jest.fn(),
    set: jest.fn(),
  } as unknown as Cache;

  beforeEach(async () => {
    authorRepositoryMock = {} as unknown as Repository<Author>;
    roleRepositoryMock = {} as unknown as Repository<Role>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorResolver,
        AuthorService,
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: roleRepositoryMock,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: authorRepositoryMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthorResolver>(AuthorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
