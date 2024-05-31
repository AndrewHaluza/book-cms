import { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import envConfig from 'src/components/app/configs/env';
import graphqlConfig from 'src/components/app/configs/graphql';
import throttlerConfig from 'src/components/app/configs/throttler';
import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';
import { BookModule } from '../book/book.module';
import { RoleModule } from '../role/role.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DB_SQL_CONFIG from './configs/db-sql';
import { GqlThrottlerGuard } from './guards/qraphql-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig()),
    ConfigModule.forRoot(envConfig()),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig()),
    TypeOrmModule.forRoot(DB_SQL_CONFIG()),
    AuthModule,
    UsersModule,
    BookModule,
    AuthorModule,
    RoleModule,
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
