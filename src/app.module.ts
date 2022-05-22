import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoginController } from './modules/user/login.controller';
import { UserController } from './modules/user/user.controller';
import { TasksSchedule } from './services/task.schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [LoginController, UserController],
  providers: [TasksSchedule],
})
export class AppModule {}
