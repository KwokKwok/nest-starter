import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app/app.config';
import { LoginController } from './modules/user/login.controller';
import { UserController } from './modules/user/user.controller';
import { User } from './modules/user/user.entity';
import { AuthService, JwtStrategy, MyAuthGuard } from './services/auth.service';
import { TasksSchedule } from './services/task.schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(AppConfig.TypeOrmConfig),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: AppConfig.JWT_SECRET,
      // https://github.com/auth0/node-jsonwebtoken#usage
      signOptions: { expiresIn: AppConfig.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [LoginController, UserController],
  providers: [
    TasksSchedule,
    AuthService,
    JwtStrategy,
    {
      // 全局启用
      provide: APP_GUARD,
      useClass: MyAuthGuard,
    },
  ],
})
export class AppModule {}
