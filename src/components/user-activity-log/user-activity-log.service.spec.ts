import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  DYNAMODB_CLIENT,
  DynamoDBClientModule,
} from '../aws/dynamodb/aws-dynamodb.module';
import { UserActivityLogEntity } from './entities/user-activity-log.entity';
import { UserActivityLogService } from './user-activity-log.service';

describe('UserActivityLogService', () => {
  let service: UserActivityLogService;
  const userActivityLogEntityRepositoryMock =
    {} as Repository<UserActivityLogEntity>;
  const DynamoDBClientModuleMock = {} as DynamoDBClientModule;
  const cacheManagerMock = {
    get: jest.fn(),
    set: jest.fn(),
  } as unknown as Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActivityLogService,
        {
          provide: getRepositoryToken(UserActivityLogEntity),
          useValue: userActivityLogEntityRepositoryMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
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

    service = module.get<UserActivityLogService>(UserActivityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
