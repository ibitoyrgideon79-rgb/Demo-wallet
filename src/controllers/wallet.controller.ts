import type { Request, Response } from "express";

import { WalletService } from "../services/wallet.service";
import { fromMinorUnits } from "../utils/money";
import {
  validateFundWalletInput,
  validateTransferFundsInput,
  validateWithdrawFundsInput,
} from "../utils/validation";

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

export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  async getWallet(request: Request, response: Response): Promise<void> {
    const wallet = await this.walletService.getWalletForUser(request.authUser!.userId);

    response.status(200).json({
      message: "Wallet retrieved successfully",
      data: serializeWallet(wallet),
    });
  }

  async getTransactions(request: Request, response: Response): Promise<void> {
    const transactions = await this.walletService.getWalletTransactions(request.authUser!.userId);

    response.status(200).json({
      message: "Wallet transactions retrieved successfully",
      data: transactions.map((transaction) => ({
        id: transaction.id,
        transactionReference: transaction.transactionReference,
        type: transaction.type,
        amount: fromMinorUnits(transaction.amountMinor),
        balanceBefore: fromMinorUnits(transaction.balanceBeforeMinor),
        balanceAfter: fromMinorUnits(transaction.balanceAfterMinor),
        counterpartyWalletId: transaction.counterpartyWalletId,
        description: transaction.description,
        createdAt: transaction.createdAt,
      })),
    });
  }

  async fundWallet(request: Request, response: Response): Promise<void> {
    const input = validateFundWalletInput(request.body);
    const wallet = await this.walletService.fundWallet(request.authUser!.userId, input);

    response.status(200).json({
      message: "Wallet funded successfully",
      data: serializeWallet(wallet),
    });
  }

  async transferFunds(request: Request, response: Response): Promise<void> {
    const input = validateTransferFundsInput(request.body);
    const wallet = await this.walletService.transferFunds(request.authUser!.userId, input);

    response.status(200).json({
      message: "Transfer completed successfully",
      data: serializeWallet(wallet),
    });
  }

  async withdrawFunds(request: Request, response: Response): Promise<void> {
    const input = validateWithdrawFundsInput(request.body);
    const wallet = await this.walletService.withdrawFunds(request.authUser!.userId, input);

    response.status(200).json({
      message: "Withdrawal completed successfully",
      data: serializeWallet(wallet),
    });
  }
}
