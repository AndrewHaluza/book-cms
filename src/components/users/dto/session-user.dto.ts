import { PickType } from '@nestjs/swagger';

import { RoleType } from '../../role/constants/roles';
import { User } from '../entities/user.entity';

export class SessionUser extends PickType(User, ['id', 'email']) {
  role: RoleType;
}
