import { PrismaClient } from "@prisma/client";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});