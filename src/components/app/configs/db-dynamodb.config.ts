import { DynamoDBModuleOptions } from 'nestjs-dynamodb';

export default (): DynamoDBModuleOptions => ({
  AWSConfig: {
    region: process.env.DYNAMODB_AWS_REGION,
    accessKeyId: process.env.DYNAMODB_AWS_ACCESS_KEY_ID, // needed if the AWS SDK is unable to find these values
    secretAccessKey: process.env.DYNAMODB_AWS_SECRET_ACCESS_KEY, // needed if the AWS SDK is unable to find these values
  },
  dynamoDBOptions: {
    sslEnabled: process.env.DYNAMODB_SSL === 'true',
    region: process.env.DYNAMODB_REGION || 'local',
    endpoint: `${process.env.DYNAMODB_HOST || 'localhost'}:${process.env.DYNAMODB_PORT || 8000}`,
  },
});
