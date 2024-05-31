import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';

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

  @ManyToOne(() => Role, (role) => role.users)
  @JoinTable()
  @Field(() => Role!)
  role: Role;
}
