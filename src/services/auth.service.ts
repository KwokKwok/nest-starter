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
