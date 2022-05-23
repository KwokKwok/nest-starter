import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app/app.config';
import { LoginController } from './modules/user/login.controller';
import { UserController } from './modules/user/user.controller';
import { User } from './modules/user/user.entity';
import { TasksSchedule } from './services/task.schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(AppConfig.TypeOrmConfig),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [LoginController, UserController],
  providers: [TasksSchedule],
})
export class AppModule {}
