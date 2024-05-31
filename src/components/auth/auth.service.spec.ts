import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from '../author/entities/author.entity';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let authorRepositoryMock: Repository<Author>;
  const userRepositoryMock = {} as unknown as Repository<User>;
  const roleRepositoryMock = {} as unknown as Repository<Role>;

  beforeEach(async () => {
    authorRepositoryMock = {} as unknown as Repository<Author>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        RoleService,
        {
          provide: getRepositoryToken(Author),
          useValue: authorRepositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: roleRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
