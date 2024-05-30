import { User } from 'src/components/users/entities/user.entity';
import { JWTTokensOutput } from './jwt-tokens.output';

export class AuthOutput extends JWTTokensOutput {
  data: User;
}
