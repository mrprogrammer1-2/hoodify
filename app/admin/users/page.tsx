import { getAllUsers } from "@/lib/queries/userQueries";

import UsersClient from "./components/UsersClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import UsersTable from "./components/UsersTable";
import SearchBar from "../components/SearchBar";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, search } = await searchParams;
  // const users = await getAllUsers();

  return (
    <div className="w-full h-full">
      <SearchBar action="/admin/users" userId={userId} defaultSearch={search} />
      <h1 className="bg-neutral-700 text-white text-center text-xl py-2">
        All Users
      </h1>
      <Suspense fallback={<Loader />}>
        <UsersTable search={search} />
      </Suspense>
    </div>
  );
}
