import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { AuthRepository } from "../repositories/auth.repository";
import { UserRepository } from "../repositories/user.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { AuthService } from "../services/auth.service";
import { BlacklistService } from "../services/blacklist.service";
import { UserService } from "../services/user.service";

const authRouter = Router();
const userRepository = new UserRepository();
const walletRepository = new WalletRepository();
const authRepository = new AuthRepository();
const blacklistService = new BlacklistService();
const userService = new UserService(userRepository, walletRepository, blacklistService);
const authService = new AuthService(userRepository, authRepository);
const authController = new AuthController(userService, authService);

authRouter.post("/register", async (request, response) => authController.register(request, response));
authRouter.post("/login", async (request, response) => authController.login(request, response));

export default authRouter;
