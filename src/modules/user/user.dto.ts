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
