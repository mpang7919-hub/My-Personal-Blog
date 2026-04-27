import { eq } from "drizzle-orm";
import { getDb } from "../client";
import { siteSettingsTable } from "../schema";

export async function getSiteSettingsMap() {
  const db = getDb();
  const rows = await db.select().from(siteSettingsTable);

  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.settingKey] = row.settingValue;
    return acc;
  }, {});
}

export async function upsertSiteSetting(settingKey: string, settingValue: string) {
  const db = getDb();
  const existing = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.settingKey, settingKey))
    .limit(1);

  if (existing[0]) {
    return db
      .update(siteSettingsTable)
      .set({
        settingValue,
        updatedAt: new Date(),
      })
      .where(eq(siteSettingsTable.settingKey, settingKey));
  }

  return db.insert(siteSettingsTable).values({
    settingKey,
    settingValue,
  });
}

export async function updateSiteSettings(
  values: Record<string, string>,
) {
  for (const [settingKey, settingValue] of Object.entries(values)) {
    await upsertSiteSetting(settingKey, settingValue);
  }
}
