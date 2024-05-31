import { SessionUser } from '../../users/dto/session-user.dto';
import { JWTTokensOutput } from './jwt-tokens.output';

export class AuthOutput extends JWTTokensOutput {
  data: SessionUser;
}
