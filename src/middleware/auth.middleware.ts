import type { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";

export function authMiddleware(authService: AuthService) {
  return async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    try {
      const authorizationHeader = request.headers.authorization;

      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Bearer token is required");
      }

      const token = authorizationHeader.slice("Bearer ".length).trim();

      if (!token) {
        throw new UnauthorizedError("Bearer token is required");
      }

      request.authUser = await authService.authenticate(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}
