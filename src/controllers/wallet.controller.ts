import type { Request, Response } from "express";

import { WalletService } from "../services/wallet.service";
import { fromMinorUnits } from "../utils/money";

export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  async getWallet(request: Request, response: Response): Promise<void> {
    const wallet = await this.walletService.getWalletForUser(request.authUser!.userId);

    response.status(200).json({
      message: "Wallet retrieved successfully",
      data: {
        ...wallet,
        balance: fromMinorUnits(wallet.balanceMinor),
      },
    });
  }

  async getTransactions(request: Request, response: Response): Promise<void> {
    const transactions = await this.walletService.getWalletTransactions(request.authUser!.userId);

    response.status(200).json({
      message: "Wallet transactions retrieved successfully",
      data: transactions.map((transaction) => ({
        ...transaction,
        amount: fromMinorUnits(transaction.amountMinor),
        balanceBefore: fromMinorUnits(transaction.balanceBeforeMinor),
        balanceAfter: fromMinorUnits(transaction.balanceAfterMinor),
      })),
    });
  }

  async fundWallet(request: Request, response: Response): Promise<void> {
    const wallet = await this.walletService.fundWallet(request.authUser!.userId, request.body);

    response.status(200).json({
      message: "Wallet funded successfully",
      data: {
        ...wallet,
        balance: fromMinorUnits(wallet.balanceMinor),
      },
    });
  }

  async transferFunds(request: Request, response: Response): Promise<void> {
    const wallet = await this.walletService.transferFunds(request.authUser!.userId, request.body);

    response.status(200).json({
      message: "Transfer completed successfully",
      data: {
        ...wallet,
        balance: fromMinorUnits(wallet.balanceMinor),
      },
    });
  }

  async withdrawFunds(request: Request, response: Response): Promise<void> {
    const wallet = await this.walletService.withdrawFunds(request.authUser!.userId, request.body);

    response.status(200).json({
      message: "Withdrawal completed successfully",
      data: {
        ...wallet,
        balance: fromMinorUnits(wallet.balanceMinor),
      },
    });
  }
}
