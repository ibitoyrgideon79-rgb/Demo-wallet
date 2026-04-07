import { Router } from "express";

import { WalletController } from "../controllers/wallet.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRepository } from "../repositories/auth.repository";
import { UserRepository } from "../repositories/user.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { AuthService } from "../services/auth.service";
import { WalletService } from "../services/wallet.service";

const walletRouter = Router();
const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const walletRepository = new WalletRepository();
const authService = new AuthService(userRepository, authRepository);
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

walletRouter.use(authMiddleware(authService));

walletRouter.get("/me", async (request, response) => walletController.getWallet(request, response));
walletRouter.get("/transactions", async (request, response) => walletController.getTransactions(request, response));
walletRouter.post("/fund", async (request, response) => walletController.fundWallet(request, response));
walletRouter.post("/transfer", async (request, response) => walletController.transferFunds(request, response));
walletRouter.post("/withdraw", async (request, response) => walletController.withdrawFunds(request, response));

export default walletRouter;
