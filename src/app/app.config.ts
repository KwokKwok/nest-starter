import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppEnvironmentType } from './app.enums';

export class AppConfig {
  static get ENV(): AppEnvironmentType {
    return process.env.NODE_ENV as AppEnvironmentType;
  }

  static IS_DEV_MODE = AppConfig.ENV === AppEnvironmentType.DEV;

  static get TypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: AppConfig.IS_DEV_MODE ? 'localhost' : 'your.remote.host',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
