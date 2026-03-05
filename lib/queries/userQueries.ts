import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq, ilike, or, and } from "drizzle-orm";

export const getUserById = async (userId: string) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return user[0];
};

export const getAllUsers = async (search?: string) => {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
        ilike(usersTable.email, `%${search}%`),
      ),
    );
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  console.log("server", users);
  return users;
};
