import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";

export const getDbUser = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return null;

  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.kindeId, user.id));

  return dbUser[0];
};
