import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../../components/users/entities/user.entity';
import { ROLES, RoleType } from '../constants/roles';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: false })
  id: number;

  @Column({ default: ROLES.user })
  @Field({ defaultValue: ROLES.user })
  name: RoleType;

  @OneToMany(() => User, (user) => user.role)
  @JoinTable()
  @Field(() => [User])
  users: User[];
}
