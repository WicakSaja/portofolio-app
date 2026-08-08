import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma-client/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

declare global {
  var prismaClient: PrismaClient | undefined;
}

export const prisma = globalThis.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = prisma;
}