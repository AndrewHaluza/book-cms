import { Field, ObjectType, PickType } from '@nestjs/graphql';

import { RoleType } from '../../role/constants/roles';
import { User } from '../entities/user.entity';

@ObjectType()
export class SessionUser extends PickType(User, ['id', 'email']) {
  @Field({})
  role: RoleType;
}
