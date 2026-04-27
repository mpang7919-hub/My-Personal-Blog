import { eq } from 'drizzle-orm';
import { g as getDb, s as siteSettingsTable } from './auth_B_88mTGx.mjs';

async function getSiteSettingsMap() {
  const db = getDb();
  const rows = await db.select().from(siteSettingsTable);
  return rows.reduce((acc, row) => {
    acc[row.settingKey] = row.settingValue;
    return acc;
  }, {});
}
async function upsertSiteSetting(settingKey, settingValue) {
  const db = getDb();
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.settingKey, settingKey)).limit(1);
  if (existing[0]) {
    return db.update(siteSettingsTable).set({
      settingValue,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(siteSettingsTable.settingKey, settingKey));
  }
  return db.insert(siteSettingsTable).values({
    settingKey,
    settingValue
  });
}
async function updateSiteSettings(values) {
  for (const [settingKey, settingValue] of Object.entries(values)) {
    await upsertSiteSetting(settingKey, settingValue);
  }
}

export { getSiteSettingsMap as g, updateSiteSettings as u };
