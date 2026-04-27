import { eq } from "drizzle-orm";
import { getDb } from "../client";
import { sessionsTable, usersTable } from "../schema";

export async function createSession(values: typeof sessionsTable.$inferInsert) {
  const db = getDb();
  return db.insert(sessionsTable).values(values);
}

export async function getSessionWithUser(token: string) {
  const db = getDb();
  const rows = await db
    .select({
      sessionId: sessionsTable.id,
      token: sessionsTable.token,
      userId: sessionsTable.userId,
      expiresAt: sessionsTable.expiresAt,
      email: usersTable.email,
      displayName: usersTable.displayName,
      role: usersTable.role,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
    .where(eq(sessionsTable.token, token))
    .limit(1);

  return rows[0] ?? null;
}

export async function deleteSession(token: string) {
  const db = getDb();
  return db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}

export async function deleteExpiredSessions(now = new Date()) {
  const db = getDb();
  const allSessions = await db.select().from(sessionsTable);
  const expired = allSessions.filter((session) => session.expiresAt < now);

  for (const session of expired) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
  }
}
