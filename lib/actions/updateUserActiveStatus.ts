"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const updateUserActiveStatus = async (
  userId: string,
  active: boolean,
) => {
  await db
    .update(usersTable)
    .set({ active })
    .where(eq(usersTable.id, userId));
};
