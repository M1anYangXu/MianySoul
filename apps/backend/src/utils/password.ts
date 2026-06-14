import bcrypt from "bcryptjs";

/**
 * 密码加密工具
 */
export const PasswordUtil = {
  /**
   * 加密密码
   */
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * 验证密码
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },
};
