import React from "react";
import NavClient from "./NavClient";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getDbUser } from "@/lib/actions/getDbUser";

export default async function Nav() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = user ? await getDbUser() : null;

  return <NavClient user={dbUser} />;
}
