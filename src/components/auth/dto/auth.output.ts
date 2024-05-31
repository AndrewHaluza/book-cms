import { SessionUser } from 'src/components/users/dto/session-user.dto';
import { JWTTokensOutput } from './jwt-tokens.output';

export class AuthOutput extends JWTTokensOutput {
  data: SessionUser;
}
