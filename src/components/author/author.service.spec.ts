import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleService } from '../role/role.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Author } from './entities/author.entity';

describe('AuthorService', () => {
  let service: AuthorService;
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

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
