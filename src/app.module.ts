import { Module } from '@nestjs/common';
import { LoginController } from './modules/user/login.controller';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [],
  controllers: [LoginController, UserController],
  providers: [],
})
export class AppModule {}
