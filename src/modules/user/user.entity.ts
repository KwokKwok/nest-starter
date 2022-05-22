import { LoginDto } from './user.dto';

export class User {
  id: number;
  name: string;
  password: string;
  followers: number[] = [];
  records: Date[] = [];
  note = '';

  removeSensitive() {
    return { ...this, password: undefined };
  }

  static fromDto(dto: LoginDto) {
    const newUser = new User();
    const { name, password } = dto;
    Object.assign(newUser, { name, password });
    return newUser;
  }

  static all: User[] = [];
}
