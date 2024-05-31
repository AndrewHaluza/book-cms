import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { RoleType } from 'src/components/role/constants/roles';

export class SessionUser extends PickType(User, ['id', 'email']) {
  role: RoleType;
}
