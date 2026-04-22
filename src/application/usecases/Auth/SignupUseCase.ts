import bcrypt from "bcryptjs";
import { IAuthRepository } from "../../interfaces/IAuthRepository";

export class SignupUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    // Validate inputs
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    // Check if email already registered
    const existing = await this.authRepo.findByEmail(email);
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.authRepo.create({ name, email, password: hashedPassword });

    // Return without password
    const { password: _pw, ...safeUser } = user as any;
    return safeUser;
  }
}
