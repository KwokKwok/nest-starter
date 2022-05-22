import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LoginDto } from './user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  @Get()
  async all() {
    return User.all.map((item) => item.removeSensitive());
  }

  @Post()
  async add(@Body() dto: LoginDto) {
    const newUser = User.fromDto(dto);
    newUser.id = Math.max(0, ...User.all.map((item) => item.id)) + 1;
    User.all.push(newUser);
    return newUser.removeSensitive();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const users = User.all;
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) throw new NotFoundException('用户不存在');
    users.splice(index, 1);
  }
}
