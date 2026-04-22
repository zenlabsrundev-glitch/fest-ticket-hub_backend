import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthRepository } from "../../interfaces/IAuthRepository";

export class LoginUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(data: { email: string; password: string }) {
    const { email, password } = data;

    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Find user
    const user = await this.authRepo.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    // Return token + safe user (no password)
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
