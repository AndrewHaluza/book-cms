import { ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamoDBModule } from 'nestjs-dynamodb';

import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';
import { BookModule } from '../book/book.module';
import { RoleModule } from '../role/role.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import cacheConfig from './configs/cache.config';
import dbDynamodbConfig from './configs/db-dynamodb.config';
import sqlDbConfig from './configs/db-sql';
import envConfig from './configs/env';
import graphqlConfig from './configs/graphql';
import throttlerConfig from './configs/throttler';
import { GqlThrottlerGuard } from './guards/qraphql-throttler.guard';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig()),
    ConfigModule.forRoot(envConfig()),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig()),
    TypeOrmModule.forRoot(sqlDbConfig()),
    CacheModule.register(cacheConfig()),
    // initialize the dynamodb and models
    DynamoDBModule.forRoot(dbDynamodbConfig()),
    AuthModule,
    UsersModule,
    BookModule,
    AuthorModule,
    RoleModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
