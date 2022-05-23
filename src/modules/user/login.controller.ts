import {
  Body,
  Post,
  Request,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { ApiController } from 'src/app/app.decorator';
import { AuthService, NoAuth } from 'src/services/auth.service';
import { LoginDto } from './user.dto';

@ApiController('login', '登录')
export class LoginController {
  constructor(private authService: AuthService) {}

  @NoAuth()
  @Post()
  async login(@Body() { name, password }: LoginDto) {
    const user = await this.authService.validate(name, password);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return await this.authService.generateToken(user);
  }

  @Get('status')
  async status(@Request() req) {
    return req.user;
  }
}
