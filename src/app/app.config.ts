import { AppEnvironmentType } from './app.enums';

export class AppConfig {
  static get ENV(): AppEnvironmentType {
    return process.env.NODE_ENV as AppEnvironmentType;
  }

  static IS_DEV_MODE = AppConfig.ENV === AppEnvironmentType.DEV;
}
