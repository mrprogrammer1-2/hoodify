import Dashboard from "./components/Dashboard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function AdminPage() {
  // const { getPermissions } = getKindeServerSession();
  // const permissions = await getPermissions();
  // // console.log("permissions", permissions);
  // const hasPermission = permissions?.permissions.includes("admin:allowed");
  // console.log(hasPermission);
  // if (hasPermission) {
  //   // User has permission
  // }

  return (
    <div>
      <Dashboard />
    </div>
  );
}
