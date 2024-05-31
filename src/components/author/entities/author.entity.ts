import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from '../../book/entities/book.entity';

@Entity()
@ObjectType()
export class Author {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field({})
  @Index({ fulltext: true })
  fullName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field({})
  birthDate: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @Field(() => [Book], {})
  books: Book[];
}
