import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

/**
 * @see [定时任务](https://docs.nestjs.cn/8/techniques?id=%e5%ae%9a%e6%97%b6%e4%bb%bb%e5%8a%a1)
 */
@Injectable()
export class TasksSchedule {
  private readonly logger = new Logger(TasksSchedule.name);

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  task1() {
    this.logger.debug('task1 - 每天下午6点执行一次');
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  task2() {
    this.logger.debug('task2 - 每2小时执行一次');
  }

  @Interval(30 * 60 * 1000)
  task3() {
    this.logger.debug('task3 - 每30分钟执行一次');
  }

  @Timeout(5 * 1000)
  task4() {
    this.logger.debug('task4 - 启动5s后执行一次');
  }
}
