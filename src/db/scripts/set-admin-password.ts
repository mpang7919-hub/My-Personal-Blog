import "dotenv/config";
import { getUserByEmail, updateUserPasswordByEmail } from "../repositories/users";
import { hashPassword } from "../../lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required.");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error(`User not found for email: ${email}`);
  }

  const passwordHash = await hashPassword(password);
  await updateUserPasswordByEmail(email, passwordHash);

  console.log(`Admin password updated for ${email}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
