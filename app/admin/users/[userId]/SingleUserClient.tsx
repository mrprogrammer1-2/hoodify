"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

type Props = {
  user: User;
  totalSpent: number;
  totalOrders: number;
  recentOrders: {
    id: string;
    status:
      | "cart"
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled";
    totalPrice: number;
    createdAt: Date;
  }[];
};

const SingleUserPage = ({
  user,
  totalSpent,
  totalOrders,
  recentOrders,
}: Props) => {
  const router = useRouter();

  // 🔹 Replace with real user data from DB
  //   const user = {
  //     id: "2a454917-73e1-4ddb-a425-d722b22715ba",
  //     name: "John Doe",
  //     email: "john.doe@gmail.com",
  //     username: "john.doe",
  //     phone: "+1 234 5678",
  //     address: "New York, NY",
  //     role: "Admin",
  //     status: "Active",
  //     createdAt: "2025-01-01",
  //     totalOrders: 12,
  //     pendingOrders: 3,
  //     totalSpent: 1450,
  //     recentOrders: [
  //       {
  //         id: "ORD-1001",
  //         date: "2025-02-20",
  //         status: "Delivered",
  //         total: 250,
  //       },
  //       {
  //         id: "ORD-1002",
  //         date: "2025-02-22",
  //         status: "Pending",
  //         total: 180,
  //       },
  //       {
  //         id: "ORD-1003",
  //         date: "2025-02-25",
  //         status: "Processing",
  //         total: 320,
  //       },
  //     ],
  //   };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src="https://avatars.githubusercontent.com/u/1486366" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              {/* <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge
                  variant={user.status === "Active" ? "default" : "destructive"}
                >
                  {user.status}
                </Badge>
              </div> */}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Edit</Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/orders?userId=${user.id}`)}
            >
              View Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h2 className="text-2xl font-bold">{totalOrders}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            {/* <h2 className="text-2xl font-bold">{user.pendingOrders}</h2> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <h2 className="text-2xl font-bold">
              ${totalSpent.toLocaleString()}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* ================= USER INFO ================= */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Username</span>
            <span>
              {user.firstName} {user.lastName}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Phone</span>
            {/* <span>{user.phone}</span> */}
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Address</span>
            {/* <span>{user.address}</span> */}
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Joined</span>
            {/* <span>{user.createdAt}</span> */}
          </div>
        </CardContent>
      </Card>

      {/* ================= RECENT ORDERS ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/orders?userId=${user.id}`)}
          >
            View All
          </Button>
        </CardHeader>

        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No orders found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : order.status === "processing"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${Number(order.totalPrice)?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleUserPage;
