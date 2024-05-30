import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from 'src/components/book/entities/book.entity';

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

  @Column()
  @Field({})
  email: string;

  @Column()
  @Field({})
  birthDate: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @Field(() => [Book], {})
  books: Book[];
}
