import { Body, Post, UnauthorizedException, Controller } from '@nestjs/common';
import { LoginDto } from './user.dto';
import { User } from './user.entity';

@Controller('login')
export class LoginController {
  @Post()
  async login(@Body() { name, password }: LoginDto) {
    const user = User.all.find(
      (item) => item.name === name && item.password === password,
    );
    if (!user) throw new UnauthorizedException('用户名或密码错误');
    return user.removeSensitive();
  }
}
