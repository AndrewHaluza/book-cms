import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DYNAMODB_CLIENT = 'DynamoDBClientModule';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DYNAMODB_CLIENT,
      useFactory: async (configService: ConfigService) => {
        return new DynamoDBClient({
          region: configService.get('DYNAMODB_AWS_REGION'),
          endpoint: `http://${configService.get('DYNAMODB_HOST')}:${configService.get('DYNAMODB_PORT')}`,
          credentials: {
            accessKeyId: configService.get('DYNAMODB_AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get(
              'DYNAMODB_AWS_SECRET_ACCESS_KEY',
            ),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DYNAMODB_CLIENT],
})
export class DynamoDBClientModule {}
