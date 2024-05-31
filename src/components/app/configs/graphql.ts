import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

export default (): ApolloDriverConfig => ({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
});
