import { AttributeValue } from '@aws-sdk/client-dynamodb';

export function unwrapDynamoDbResult<T>(
  dynamoDbResult: Record<string, AttributeValue>[],
) {
  return dynamoDbResult.map(process<T>);
}

function process<T>(dynamoDbResult) {
  return Object.entries(dynamoDbResult).reduce((acc, [key, value]) => {
    const dynamoDbType = Object.keys(value)[0];
    acc[key] = value[dynamoDbType];
    return acc;
  }, {} as T);
}
