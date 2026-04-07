import type { LoginInput, RegisterUserInput } from "../types/auth.types";
import type { FundWalletInput, TransferFundsInput, WithdrawFundsInput } from "../types/wallet.types";
import { BadRequestError } from "./errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BVN_PATTERN = /^\d{11}$/;
const WALLET_NUMBER_PATTERN = /^\d{10}$/;

function requireNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new BadRequestError(`${fieldName} is required`);
  }

  return value.trim();
}

function requirePositiveAmount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new BadRequestError("Amount must be a positive number");
  }

  return value;
}

export function validateRegisterUserInput(input: unknown): RegisterUserInput {
  if (!input || typeof input !== "object") {
    throw new BadRequestError("Request body is required");
  }

  const body = input as Record<string, unknown>;
  const email = requireNonEmptyString(body.email, "Email").toLowerCase();
  const bvn = requireNonEmptyString(body.bvn, "BVN");

  if (!EMAIL_PATTERN.test(email)) {
    throw new BadRequestError("Email format is invalid");
  }

  if (!BVN_PATTERN.test(bvn)) {
    throw new BadRequestError("BVN must be 11 digits");
  }

  return {
    firstName: requireNonEmptyString(body.firstName, "First name"),
    lastName: requireNonEmptyString(body.lastName, "Last name"),
    email,
    phoneNumber: requireNonEmptyString(body.phoneNumber, "Phone number"),
    bvn,
  };
}

export function validateLoginInput(input: unknown): LoginInput {
  if (!input || typeof input !== "object") {
    throw new BadRequestError("Request body is required");
  }

  const body = input as Record<string, unknown>;
  const email = requireNonEmptyString(body.email, "Email").toLowerCase();
  const bvn = requireNonEmptyString(body.bvn, "BVN");

  if (!EMAIL_PATTERN.test(email)) {
    throw new BadRequestError("Email format is invalid");
  }

  if (!BVN_PATTERN.test(bvn)) {
    throw new BadRequestError("BVN must be 11 digits");
  }

  return { email, bvn };
}

export function validateFundWalletInput(input: unknown): FundWalletInput {
  if (!input || typeof input !== "object") {
    throw new BadRequestError("Request body is required");
  }

  const body = input as Record<string, unknown>;
  const description =
    typeof body.description === "string" && body.description.trim() ? body.description.trim() : undefined;

  return {
    amount: requirePositiveAmount(body.amount),
    description,
  };
}

export function validateWithdrawFundsInput(input: unknown): WithdrawFundsInput {
  return validateFundWalletInput(input);
}

export function validateTransferFundsInput(input: unknown): TransferFundsInput {
  if (!input || typeof input !== "object") {
    throw new BadRequestError("Request body is required");
  }

  const body = input as Record<string, unknown>;
  const recipientWalletNumber = requireNonEmptyString(body.recipientWalletNumber, "Recipient wallet number");

  if (!WALLET_NUMBER_PATTERN.test(recipientWalletNumber)) {
    throw new BadRequestError("Recipient wallet number must be 10 digits");
  }

  const description =
    typeof body.description === "string" && body.description.trim() ? body.description.trim() : undefined;

  return {
    recipientWalletNumber,
    amount: requirePositiveAmount(body.amount),
    description,
  };
}
