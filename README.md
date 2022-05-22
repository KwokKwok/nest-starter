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
