import type { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { fromMinorUnits } from "../utils/money";

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async register(request: Request, response: Response): Promise<void> {
    const registrationResult = await this.userService.registerUser(request.body);
    const token = await this.authService.issueToken(registrationResult.user.id);

    response.status(201).json({
      message: "User registered successfully",
      data: {
        token,
        user: registrationResult.user,
        wallet: {
          ...registrationResult.wallet,
          balance: fromMinorUnits(registrationResult.wallet.balanceMinor),
        },
      },
    });
  }

  async login(request: Request, response: Response): Promise<void> {
    const result = await this.authService.login(request.body);

    response.status(200).json({
      message: "Login successful",
      data: result,
    });
  }
}
