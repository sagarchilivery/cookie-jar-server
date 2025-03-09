// config/db.ts

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function ensureSequenceExists() {
  try {
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'arrival_number_seq') THEN
          CREATE SEQUENCE arrival_number_seq START 1;
        END IF;
      END $$;
    `);
    console.log("✅ Sequence 'arrival_number_seq' ensured.");
  } catch (error) {
    console.error("❌ Error ensuring sequence:", error);
  }
}

export async function getNextArrivalNumber() {
  const result = await prisma.$queryRaw<{ nextval: number }[]>`
        SELECT nextval('arrival_number_seq') as nextval;
    `;

  const nextNumber = String(result[0].nextval).padStart(3, "0"); // Ensures numbers like 001, 002, 003...
  return `ARR-${nextNumber}`;
}
