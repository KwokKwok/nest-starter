import { BaseEntity } from 'src/app/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  password: string;

  @Column('simple-json')
  followers: number[] = [];

  @Column('simple-json')
  records: Date[] = [];

  @Column('text')
  note = '';

  removeSensitive() {
    return { ...this, password: undefined };
  }

  static fromDto(user: User) {
    const newUser = new User();
    Object.assign(newUser, user);
    return newUser;
  }
}
