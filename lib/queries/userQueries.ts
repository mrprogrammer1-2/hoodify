import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { eq, ilike, or, and, sql } from "drizzle-orm";

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

export async function getTotalUsers() {
  try {
    // Drizzle recommends casting count results for PostgreSQL/Neon
    const result = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`.as("count"),
      })
      .from(usersTable);

    // Alternatively, use the $count utility wrapper (requires Drizzle v0.34.1+)
    // const totalUsers = await db.$count(users);

    // The result is an array, so we return the first element's count
    return result[0].count;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw new Error("Failed to fetch total users");
  }
}
