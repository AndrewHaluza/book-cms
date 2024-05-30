import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Author } from '../../author/entities/author.entity';

@Entity()
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: false })
  id: number;

  @Column()
  @Field({})
  @Index({ fulltext: true })
  title: string;

  @Column()
  @Field({})
  @Index({ fulltext: true })
  publishedAt: Date;

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  @Field(() => [Author])
  authors: Author[];
}
