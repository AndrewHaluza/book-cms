import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default (): TypeOrmModuleOptions => ({
  type: process.env.SQL_DB_TYPE as MysqlConnectionOptions['type'],
  port: parseInt(process.env.SQL_DB_PORT, 10),
  username: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  host: process.env.SQL_DB_HOST,
  database: process.env.SQL_DB_NAME,
  synchronize: true,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
});
