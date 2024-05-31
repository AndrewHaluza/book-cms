import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../role/role.module';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), RoleModule],
  providers: [AuthorResolver, AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
