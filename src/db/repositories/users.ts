import { eq } from "drizzle-orm";
import { getDb } from "../client";
import { usersTable } from "../schema";

export async function getUserByEmail(email: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return rows[0] ?? null;
}

export async function createUser(values: typeof usersTable.$inferInsert) {
  const db = getDb();
  return db.insert(usersTable).values(values);
}

export async function updateUserPasswordByEmail(email: string, passwordHash: string) {
  const db = getDb();
  return db
    .update(usersTable)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.email, email));
}
