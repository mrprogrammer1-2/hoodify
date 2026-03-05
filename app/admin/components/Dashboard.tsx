"use client";

import AdminAreaChart from "./AdminAreaChart";
import AdminBarChart from "./AdminBarChart";
import AdminPieChart from "./AdminPieChart";
import CardList from "./CardList";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AdminBarChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Transactions" />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AdminPieChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-3 xl:col-span-1 2xl:col-span-3">
        <AdminAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Popular Products" />
      </div>
    </div>
  );
}
