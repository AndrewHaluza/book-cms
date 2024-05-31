import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from 'src/components/book/entities/book.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
