import { Request, Response } from "express";
import { AuthRepository } from "../repositories/AuthRepository";
import { SignupUseCase } from "../../application/usecases/Auth/SignupUseCase";
import { LoginUseCase } from "../../application/usecases/Auth/LoginUseCase";
import { Logger } from "../../shared/logger";

export class AuthController {
  private signupUC: SignupUseCase;
  private loginUC: LoginUseCase;

  constructor() {
    const authRepo = new AuthRepository();
    this.signupUC = new SignupUseCase(authRepo);
    this.loginUC = new LoginUseCase(authRepo);
  }

  // POST /api/v1/auth/signup
  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.signupUC.execute({ name, email, password });
      Logger.info(`✅ New user registered: ${email}`);
      res.status(201).json({
        success: true,
        message: "Account created successfully.",
        data: user,
      });
    } catch (error: any) {
      Logger.error(`Signup error: ${error.message}`);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // POST /api/v1/auth/login
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUC.execute({ email, password });
      Logger.info(`✅ User logged in: ${email}`);
      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error: any) {
      Logger.error(`Login error: ${error.message}`);
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
