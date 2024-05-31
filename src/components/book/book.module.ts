import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorModule } from '../author/author.module';
import { RoleModule } from '../role/role.module';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule, RoleModule],
  providers: [BookResolver, BookService],
})
export class BookModule {}
