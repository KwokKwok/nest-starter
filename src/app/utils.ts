import { hash } from 'bcrypt';

export class MD5 {
  private static SALT = '$2b$10$qWKATnl./4/OryuF/SOMhu';

  /**
   * 散列处理
   * @see https://www.jianshu.com/p/2b131bfc2f10
   */
  static async encode(str: string) {
    return await hash(str, this.SALT);
  }
}
