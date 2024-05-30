import { User } from 'src/components/users/entities/user.entity';
import { OmitType } from '@nestjs/swagger';

export class SignUpInput extends OmitType(User, ['id']) {}
