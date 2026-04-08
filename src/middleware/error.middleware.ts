import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/errors";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({
      message: "Request body contains invalid JSON",
    });
    return;
  }

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
