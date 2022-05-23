import {
  Body,
  Post,
  Request,
  UnauthorizedException,
  Controller,
  Get,
} from '@nestjs/common';
import { AuthService, NoAuth } from 'src/services/auth.service';
import { LoginDto } from './user.dto';

@Controller('login')
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
