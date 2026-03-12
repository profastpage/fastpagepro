import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __fastpage_prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__fastpage_prisma__ ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__fastpage_prisma__ = prisma;
}
