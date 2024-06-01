import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorModule } from '../author/author.module';
import { RoleModule } from '../role/role.module';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { UserActivityLogModule } from '../user-activity-log/user-activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    AuthorModule,
    RoleModule,
    UserActivityLogModule,
  ],
  providers: [BookResolver, BookService],
})
export class BookModule {}
