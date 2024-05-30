import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: false })
  id: number;

  @ApiProperty()
  @Column()
  @IsEmail()
  @Field({})
  @Index({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Field({})
  fullName: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsNotEmpty()
  @Field({})
  password: string;
}
