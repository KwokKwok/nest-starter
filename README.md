# nest-starter

---

## 零、初始化项目

步骤：

1. 创建起始项目
2. 结构简化、调整配置
3. 区分正式和开发环境

创建项目：

```bash
npm i -g @nestjs/cli
nest new project-name
```

运行 `start` 脚本，打开浏览器地址访问 `http://localhost:3000` (_端口号在 `src/main.ts` 中设置_)

环境区分：

使用 `cross-env` 在 npm 脚本执行前定义 `NODE_ENV` 环境变量

```bash
ni -D cross-env
```

> package.json

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=dev nest start --watch",
    "start:prod": "cross-env NODE_ENV=prod node dist/main",
  },
  // ...
}
```

---

## 一、RESTful API 与 数据校验

步骤：

1. 创建 用户的查询、新增、删除接口。实现从 请求体、路由 上取参数
2. 数据[校验](https://docs.nestjs.cn/8/pipes?id=%e7%b1%bb%e9%aa%8c%e8%af%81%e5%99%a8)和[转换](https://docs.nestjs.cn/8/pipes?id=%e8%bd%ac%e6%8d%a2%e7%ae%a1%e9%81%93)
3. 根据情况返回不同的状态码和信息
4. [使用内置异常](https://docs.nestjs.cn/8/exceptionfilters?id=%e5%86%85%e7%bd%aehttp%e5%bc%82%e5%b8%b8)与[自定义异常处理逻辑](https://docs.nestjs.cn/8/exceptionfilters?id=%e5%bc%82%e5%b8%b8%e8%bf%87%e6%bb%a4%e5%99%a8-1)

创建组件类后，需要注册到 `app.module` 才能生效。也可以使用 `nest cli` 创建组件并自动注册到 `app.module`，参考[官方文档](https://docs.nestjs.cn/8/cli?id=nest-generate)。比如我创建 controller 的方式：

```bash
# 安装类验证器和转换器
ni class-validator class-transformer

# 在 modules/${path} 路径下生成一个 ${name}.controller.ts
# --flat 指示只创建文件，不加会多生成一个文件夹
# --no-spec 指示不创建测试用例
nest g controller ${name} modules/${path} --flat --no-spec

# 例子
# nest g controller login modules/user --flat --no-spec
# nest g controller user modules/user --flat --no-spec
```

> user.dto.ts

```ts
// 数据校验，这里用到的不能为空
import { IsNotEmpty } from 'class-validator';

/**
 * 登录接口 DTO
 */
export class LoginDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
```

> user.controller.ts

```ts
@Controller('user')
export class UserController {
  @Get()
  async all() {}

  // 会对 dto 做数据校验
  @Post()
  async add(@Body() dto: LoginDto) {}

  // id 转换成 int
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {}
}
```

全局启用校验：

```ts
app.useGlobalPipes(new ValidationPipe());
```

自定义异常校验逻辑（_暂时不做_）：

1. 写一个[`filter`](https://docs.nestjs.cn/8/exceptionfilters?id=%e5%bc%82%e5%b8%b8%e8%bf%87%e6%bb%a4%e5%99%a8-1)
1. 在 `src/main.ts` 中引入 `app.useGlobalFilters(new YourExceptionFilter());`

---

## 二、跨域配置

步骤：

1. 配置跨域
2. 写测试（_通过设置`Origin`然后检查`Access-Control-Allow-Origin`_）

> main.ts

```ts
async function bootstrap() {
  // ...

  // 配置参数 https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: ['http://localhost:3002'],
  });

  // ...
}
bootstrap();
```

> app.e2e-spec.ts

```ts
import * as request from 'supertest';
const SERVER_LOCATION = `http://localhost:3000`;

// 直接在服务器启动的情况下测试

describe('AppController (e2e)', () => {
  const origin = 'http://localhost:3002';
  it('跨域测试', () => {
    return request(SERVER_LOCATION)
      .options('/')
      .set('Origin', origin)
      .expect('Access-Control-Allow-Origin', origin);
  });
});
```

---

## 三、定时任务

步骤：

1. 安装
1. 写定时任务
1. 在模块中注册（_注意需要使用`imports: [ScheduleModule.forRoot()]`_）

安装：

```bash
ni @nestjs/schedule
```

[定时任务](https://docs.nestjs.cn/8/techniques?id=%e5%ae%9a%e6%97%b6%e4%bb%bb%e5%8a%a1)有三种方便的 Api：

1. `@Cron`，除了自己写 [cron 表达式](https://help.aliyun.com/document_detail/64769.html)，也可以直接使用系统定义好的 `CronExpression` 枚举
2. `@Interval`，定时执行。传入 `ms` 为单位的数值
3. `@TimeOut`，启动后延时执行一次。传入 `ms` 为单位的数值

> task.schedule.ts

```ts
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
```

---

## 四、使用 TypeORM 连接 MySQL 数据库

[官方文档](https://docs.nestjs.cn/8/techniques?id=%e6%95%b0%e6%8d%ae%e5%ba%93)

重点：

1. `TypeOrmModule.forRoot()` 用来配置数据库，导入数据库模块
2. `TypeOrmModule.forFeature()` 用来定义在当前范围中需要注册的数据库表

```bash
ni @nestjs/typeorm typeorm mysql2
```

```ts
@Module({
  imports: [
    // 导入模块
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      autoLoadEntities: true, // 自动加载 forFeature 使用到的 entity
      synchronize: true, // 自动同步数据库和字段，会在数据库中创建没有的字段
    }),
    // 定义在当前范围中需要注册的存储库
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController, LoginController],
})
export class AppModule {}
```

使用（_详细 api 参考 [Repository 模式 API 文档](https://typeorm.bootcss.com/repository-api)_）：

> user.controller.ts

```ts
@Controller('user')
export class UserController {
  constructor(
    // 依赖注入
    // 注入后就可以使用 find()、save($user) 等方法
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}
}
```

[事务](https://docs.nestjs.cn/8/techniques?id=%e4%ba%8b%e5%8a%a1)使用：

```ts
async createMany(users: User[]) {
  await this.connection.transaction(async manager => {
    await manager.save(users[0]);
    await manager.save(users[1]);
  });
}
```

---

## 五、基于 JWT 做接口鉴权

[官方文档](https://docs.nestjs.cn/8/security?id=%e8%ae%a4%e8%af%81%ef%bc%88authentication%ef%bc%89)

步骤：

1. 安装 `ni @nestjs/passport @nestjs/jwt passport passport-jwt`、`ni -D @types/passport-jwt`
1. 写认证模块（_`auth.service.ts`_）并全局引入
1. 使用`@NoAuth`配置无需认证的路由

> auth.service.ts

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MD5 } from 'src/app/utils';
import { Repository } from 'typeorm';
import { User } from '../modules/user/user.entity';
import { AuthGuard, IAuthGuard, PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../app/app.config';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * 无需认证的路由
 */
export const NoAuth = () => SetMetadata('no-auth', true);

/**
 * 认证服务。校验登录信息、生成 token
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 校验用户登录信息
   */
  async validate(name: string, password: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ name });

    if (!user || user.password !== (await MD5.encode(password))) {
      return null;
    }
    return user.removeSensitive();
  }

  /**
   * 生成 token
   */
  async generateToken(user: User) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  parseToken(token: string): User {
    return this.jwtService.decode(token) as User;
  }
}

/**
 * 认证守卫
 * @description 如果未设置 `@NoAuth()`，则使用 JwtStrategy 进行校验。配合 app.module 做全局校验用
 */
@Injectable()
export class MyAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 在这里取metadata中的no-auth，得到的会是一个bool
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());
    const guard = MyAuthGuard.getAuthGuard(noAuth);
    if (guard) {
      return guard.canActivate(context);
    }
    return true;
  }

  // 根据NoAuth的t/f选择合适的策略Guard
  private static getAuthGuard(noAuth: boolean): IAuthGuard {
    if (noAuth) {
      return null;
    } else {
      return new JwtAuthGuard();
    }
  }
}

/**
 * Jwt 校验策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

/**
 * Jwt 校验守卫
 * @description 主要为了自定义异常逻辑
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('请登录后再访问');
    }
    return user;
  }
}
```

全局启用：

> app.module.ts

```ts
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: AppConfig.JWT_SECRET,
      // https://github.com/auth0/node-jsonwebtoken#usage
      signOptions: { expiresIn: AppConfig.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [UserController, LoginController],
  providers: [
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
```

为部分无需认证的路由设置`@NoAuth`：

```diff
@Controller('login')
export class LoginController {

+ @NoAuth()
  @Post()
  async login(@Body() { name, password }: LoginDto) {}
}
```

---

## 六、使用 Swagger 自动生成接口文档

[参考文档](https://docs.nestjs.cn/8/openapi)

步骤：

1. 安装：`ni @nestjs/swagger swagger-ui-express`
1. `main.ts`中配置使用
1. `nest-cli.json`中[配置插件，以自动映射属性注释](https://docs.nestjs.cn/8/openapi?id=cli%e6%8f%92%e4%bb%b6)
1. 使用`@ApiTags`为接口分组，`@ApiOperation`为接口增加描述，`@ApiBearerAuth`为接口添加认证

> main.ts

```ts
// https://docs.nestjs.cn/8/openapi
const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API 文档')
  .setVersion('1.0')
  .addBearerAuth() // JWT 认证
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('swagger', app, document); // 挂载到 /swagger 路由下
```

注释：

1. `@ApiTags('用户管理')` 分组
2. `@ApiOperation({ summary: '获取用户信息' })` 用户函数
3. `@ApiBearerAuth()` 需要 jwt 认证，用于函数
4. 属性的注释可以通过插件配置自动生成

也可以使用[装饰器聚合](https://docs.nestjs.cn/8/customdecorators?id=%e8%a3%85%e9%a5%b0%e5%99%a8%e8%81%9a%e5%90%88)来组合使用多个装饰器：

> app.decorator.ts

```ts
import { applyDecorators, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * 复合装饰器
 */
export function ApiController(route: string, name: string = route) {
  return applyDecorators(
    ApiBearerAuth(), //
    ApiTags(name),
    Controller(route),
  );
}
```

> user.controller.ts

```diff
+@ApiController('user', '用户管理')
-@Controller('user')
-@ApiBearerAuth()
-@ApiTags('用户管理')
export class UserController {

+ @ApiOperation({ summary: '获取用户信息' })
  @Get()
  async all() {

  }
}
```

```

```
