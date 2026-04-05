"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const checkUserActive = async (): Promise<boolean> => {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id) return true; // Allow unauthenticated users

  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.kindeId, kindeUser.id));

  return dbUser[0]?.active !== false;
};
