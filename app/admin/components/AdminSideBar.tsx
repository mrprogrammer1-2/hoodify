import { getPendingOrdersCount } from "@/lib/actions/getPendingOrdersCount";
import AdminSideBarClient from "./AdminSideBarClient";

export default async function AdminSideBar() {
  const pendingCount = await getPendingOrdersCount();
  return <AdminSideBarClient pendingCount={pendingCount} />;
}
