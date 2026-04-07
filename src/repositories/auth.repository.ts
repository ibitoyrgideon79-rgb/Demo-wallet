import type { Knex } from "knex";

import { db } from "../config/database";
import type { AuthTokenModel } from "../models/auth-token.model";

type DbExecutor = Knex | Knex.Transaction;

interface AuthTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date | null;
  last_used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAuthTokenRepositoryInput {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date | null;
}

export class AuthRepository {
  private readonly tableName = "auth_tokens";

  private mapRowToModel(row: AuthTokenRow): AuthTokenModel {
    return {
      id: row.id,
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at ? new Date(row.expires_at) : null,
      lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async createAuthToken(
    input: CreateAuthTokenRepositoryInput,
    executor: DbExecutor = db,
  ): Promise<AuthTokenModel> {
    await executor<AuthTokenRow>(this.tableName).insert({
      id: input.id,
      user_id: input.userId,
      token_hash: input.tokenHash,
      expires_at: input.expiresAt,
    });

    const createdToken = await executor<AuthTokenRow>(this.tableName).where({ id: input.id }).first();

    if (!createdToken) {
      throw new Error("Failed to create auth token");
    }

    return this.mapRowToModel(createdToken);
  }

  async findAuthTokenByHash(
    tokenHash: string,
    executor: DbExecutor = db,
  ): Promise<AuthTokenModel | null> {
    const token = await executor<AuthTokenRow>(this.tableName).where({ token_hash: tokenHash }).first();
    return token ? this.mapRowToModel(token) : null;
  }

  async touchAuthToken(tokenHash: string, executor: DbExecutor = db): Promise<void> {
    await executor<AuthTokenRow>(this.tableName).where({ token_hash: tokenHash }).update({
      last_used_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
  }

  async deleteAuthTokenByHash(tokenHash: string, executor: DbExecutor = db): Promise<number> {
    return executor<AuthTokenRow>(this.tableName).where({ token_hash: tokenHash }).del();
  }
}
