import {
  BadRequestException,
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MD5 } from 'src/app/utils';
import { Repository } from 'typeorm';
import { ApiController } from 'src/app/app.decorator';
import { ApiOperation } from '@nestjs/swagger';

@ApiController('user', '用户管理')
export class UserController {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  @ApiOperation({ summary: '获取用户信息' })
  @Get()
  async all() {
    return (await this.repository.find()).map((item) => item.removeSensitive());
  }

  @Post()
  async add(@Body() _user: User) {
    let user: User = _user;
    if (user.id) {
      const oldUser = await this.repository.findOneBy({ id: user.id });
      user = Object.assign(oldUser, _user);
      console.log(user);
    } else {
      const namedUser = await this.repository.findOneBy({ name: user.name });
      if (namedUser) throw new BadRequestException('用户名已存在');
      user = User.fromDto(_user);
      user.password = await MD5.encode(user.password);
    }
    const entity = await this.repository.save(user);
    return entity.removeSensitive();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.repository.delete(id);
  }
}
