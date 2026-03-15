"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Home,
  User,
  Box,
  Settings,
  Search,
  User2,
  ChevronUp,
  Plus,
  Projector,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sideBarItems = [
  { name: "Dashboard", path: "/admin", icon: Home },
  { name: "Users", path: "/admin/users", icon: User },
  { name: "Products", path: "/admin/products", icon: Box },
  { name: "Orders", path: "/admin/orders", icon: Projector },
];

const settingsItems = [
  { name: "Pricing", path: "/admin/pricing", icon: DollarSign },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSideBarClient({
  pendingCount,
}: {
  pendingCount: number;
}) {
  const pathName = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link href={"/"}>
              <Image src="/images/logo.png" alt="Logo" width={35} height={35} />
              <span className="ml-2 text-md uppercase font-semibold">
                Hoodify
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      {/* <SidebarSeparator className="mx-2  max-w-full" /> */}
      <hr className="my-2" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarItems.map((item) => {
                const isSelected =
                  (item.path !== "/admin" &&
                    pathName.includes(item.path) &&
                    item.path.length > 1) ||
                  pathName === item.path;
                return (
                  <SidebarMenuItem
                    key={item.name}
                    className={cn(
                      "rounded-md relative",
                      isSelected && "bg-primary/10 text-primary",
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.path} title={item.name}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.name === "Orders" && pendingCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold pointer-events-none">
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">add products</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/products/new" title="Add Product">
                    <Plus />
                    <span>Add Product</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const isSelected =
                  (item.path !== "/admin" &&
                    pathName.includes(item.path) &&
                    item.path.length > 1) ||
                  pathName === item.path;
                return (
                  <SidebarMenuItem
                    key={item.name}
                    className={cn(
                      "rounded-md",
                      isSelected && "bg-primary/10 text-primary",
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.path} title={item.name}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> username <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
