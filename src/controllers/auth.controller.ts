import type { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { fromMinorUnits } from "../utils/money";
import { validateLoginInput, validateRegisterUserInput } from "../utils/validation";

function serializeUser(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };
}

function serializeWallet(wallet: {
  id: string;
  walletNumber: string;
  currency: string;
  balanceMinor: number;
}) {
  return {
    id: wallet.id,
    walletNumber: wallet.walletNumber,
    currency: wallet.currency,
    balance: fromMinorUnits(wallet.balanceMinor),
  };
}

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async register(request: Request, response: Response): Promise<void> {
    const registrationInput = validateRegisterUserInput(request.body);
    const registrationResult = await this.userService.registerUser(registrationInput);
    const token = await this.authService.issueToken(registrationResult.user.id);

    response.status(201).json({
      message: "User registered successfully",
      data: {
        token,
        user: serializeUser(registrationResult.user),
        wallet: serializeWallet(registrationResult.wallet),
      },
    });
  }

  async login(request: Request, response: Response): Promise<void> {
    const loginInput = validateLoginInput(request.body);
    const result = await this.authService.login(loginInput);

    response.status(200).json({
      message: "Login successful",
      data: {
        token: result.token,
        user: serializeUser(result.user),
      },
    });
  }
}
