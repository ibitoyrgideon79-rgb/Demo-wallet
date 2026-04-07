import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/errors";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal server error";

  response.status(500).json({
    message,
  });
}
