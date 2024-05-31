import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';
import { AuthorModule } from '../author/author.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule, RoleModule],
  providers: [BookResolver, BookService],
})
export class BookModule {}
