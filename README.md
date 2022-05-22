# nest-starter

---

### 零、初始化项目

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
