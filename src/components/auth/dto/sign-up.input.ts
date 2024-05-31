import { OmitType } from '@nestjs/swagger';

import { User } from '../../users/entities/user.entity';

export class SignUpInput extends OmitType(User, ['id']) {}
