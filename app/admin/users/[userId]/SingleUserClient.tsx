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
import { updateUserActiveStatus } from "@/lib/actions/updateUserActiveStatus";
import { useState } from "react";

type Props = {
  user: User;
  totalSpent: number;
  totalOrders: number;
  totalPendingOrders: number;
  totalCancelledOrders: number;
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

const SingleUserClient = ({
  user,
  totalSpent,
  totalOrders,
  recentOrders,
  totalPendingOrders,
  totalCancelledOrders,
}: Props) => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [userActive, setUserActive] = useState(user.active);

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      await updateUserActiveStatus(user.id, !userActive);
      setUserActive(!userActive);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <Card className="relative">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={user.avatar || undefined} className=" object-cover" />
              <AvatarFallback>
                {user.email?.charAt(0).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div
              className={`absolute flex justify-center items-center gap-1 right-1 top-2 text-white px-2 py-1 rounded-md ${userActive ? "bg-green-400" : "bg-red-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${userActive ? "bg-green-500" : "bg-red-500"}`}
              />
              <span>{userActive ? "Active" : "Inactive"}</span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={userActive ? "destructive" : "default"}
              onClick={handleToggleActive}
              disabled={isUpdating}
            >
              {isUpdating
                ? "Updating..."
                : userActive
                  ? "Deactivate User"
                  : "Activate User"}
            </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h2 className="text-2xl font-bold">{totalOrders}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <h2 className="text-2xl font-bold">{totalPendingOrders}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Cancelled Orders</p>
            <h2 className="text-2xl font-bold">{totalCancelledOrders}</h2>
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
            <span>{user.phone ?? "N/A"}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Joined</span>
            <span>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
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

export default SingleUserClient;
