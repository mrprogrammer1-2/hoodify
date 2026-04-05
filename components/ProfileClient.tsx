"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { updateUserProfile } from "@/lib/actions/updateUserProfile";
import { Spinner } from "@/components/ui/spinner";
import { RenderObject } from "./RenderObject";
import { X } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  variantColor: string | null;
  variantSize: string | null;
  imageUrl?: string;
  customization?: any;
  addOn?: any;
}

interface OrderDetails {
  id: string;
  status: string;
  currency: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  details?: OrderDetails | null;
}

interface ProfileClientProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    avatar: string | null;
  };
  orders?: Order[];
}

export default function ProfileClient({
  user,
  orders = [],
}: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const response = await fetch("/api/upload-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();
        if (data.success) {
          setAvatar(data.url);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateUserProfile(user.id, {
      ...formData,
      avatar,
    });

    if (result.success) {
      setIsEditing(false);
      window.location.reload();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="relative">
              {avatar && (
                <Image
                  src={avatar}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-full object-cover border"
                />
              )}
              {!avatar && (
                <div className="w-20 h-20 rounded-full bg-muted border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    No avatar
                  </span>
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90"
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <Spinner />
                  ) : (
                    <span className="text-sm">📷</span>
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>

              <p className="text-muted-foreground">{user.email}</p>
            </div>

            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader className="text-center mb-3">
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>

          <CardContent>
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="First Name" value={user.firstName} />
                <InfoField label="Last Name" value={user.lastName} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone" value={user.phone} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ""} disabled />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Save Changes"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchases</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {orders.length === 0 && (
              <p className="text-muted-foreground text-sm">
                You haven't placed any orders yet.
              </p>
            )}

            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => order.details && setSelectedOrder(order.details)}
                className="w-full flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>

                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${order.totalPrice}</p>

                  <p className="text-xs capitalize text-muted-foreground">
                    {order.status}
                  </p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 sticky top-0 bg-background border-b">
              <div>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Order #{selectedOrder.id.slice(0, 8)}
                </CardDescription>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-semibold">{selectedOrder.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-semibold">${selectedOrder.totalPrice}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.productName || "Product"}
                              width={120}
                              height={120}
                              className="w-28 h-28 object-cover rounded border"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">
                                {item.productName || "Unknown Product"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                ${item.unitPrice * item.quantity}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${item.unitPrice} each
                              </p>
                            </div>
                          </div>
                          <div className="text-sm space-y-1">
                            {item.variantColor && (
                              <p className="text-muted-foreground">
                                <span className="font-medium">Color:</span>{" "}
                                {item.variantColor}
                              </p>
                            )}
                            {item.variantSize && (
                              <p className="text-muted-foreground">
                                <span className="font-medium">Size:</span>{" "}
                                {item.variantSize}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Customization */}
                      {item.customization &&
                        Object.keys(item.customization).length > 0 && (
                          <div className="pt-3 border-t">
                            <p className="font-semibold text-sm mb-2">
                              Customization:
                            </p>
                            <div className="text-sm text-muted-foreground bg-muted/40 p-3 rounded">
                              <RenderObject data={item.customization} />
                            </div>
                          </div>
                        )}

                      {/* Add-ons/Patches */}
                      {item.addOn && Object.keys(item.addOn).length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="font-semibold text-sm mb-2">Add-ons:</p>
                          <div className="text-sm text-muted-foreground bg-muted/40 p-3 rounded">
                            <RenderObject data={item.addOn} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <Button onClick={() => setSelectedOrder(null)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-lg">{value || "-"}</p>
    </div>
  );
}
