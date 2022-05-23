import { Body, Post, UnauthorizedException, Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MD5 } from 'src/app/utils';
import { Repository } from 'typeorm';
import { LoginDto } from './user.dto';
import { User } from './user.entity';

@Controller('login')
export class LoginController {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  @Post()
  async login(@Body() { name, password }: LoginDto) {
    const user = await this.repository.findOneBy({ name });
    const encodePassword = await MD5.encode(password);
    if (!user || user.password !== encodePassword)
      throw new UnauthorizedException('用户名或密码错误');
    return user.removeSensitive();
  }
}
