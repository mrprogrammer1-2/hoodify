"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { CartIcon } from "./CartIcon";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useCartStore } from "@/stores/cart-store";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "./ui/sheet";

export default function NavClient({ user }: { user: User | null }) {
  const { isAuthenticated, getPermission, isLoading } = useKindeBrowserClient();
  const { clearCart } = useCartStore();
  const isAllowed = !isLoading && getPermission("admin:allowed")?.isGranted;
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.avatar) {
      setUserAvatar(user.avatar);
    }
  }, [isAuthenticated, user]);

  const resetCart = () => {
    console.log("reset cart");
    localStorage.removeItem("cart-storage");
    localStorage.removeItem("cart-synced");
    clearCart();
  };

  return (
    <header className="min-h-16 w-full shadow-md">
      <nav className="max-container flex items-center w-full h-full justify-between px-4 py-2 border-b-2">
        <div>
          <Link href="/" className="text-lg font-bold">
            <Image
              src="/images/logo.png"
              loading="eager"
              alt="Logo"
              width={55}
              height={55}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-5 items-center">
          {isLoading ? (
            <Button disabled>Loading...</Button>
          ) : !isAuthenticated ? (
            <>
              <Button>
                <LoginLink>Login</LoginLink>
              </Button>
              <Button>
                <RegisterLink>Register</RegisterLink>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="Profile"
                      width={75}
                      height={75}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center text-xs">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {isAllowed && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => resetCart()}>
                  <LogoutLink postLogoutRedirectURL="/">Logout</LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <CartIcon />
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-3 items-center">
          <CartIcon />
          <ModeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                {isLoading ? (
                  <Button disabled className="w-full">
                    Loading...
                  </Button>
                ) : !isAuthenticated ? (
                  <>
                    <Button className="w-full">
                      <LoginLink>Login</LoginLink>
                    </Button>
                    <Button className="w-full">
                      <RegisterLink>Register</RegisterLink>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center text-xs">
                          {user?.firstName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="px-4 py-2 hover:bg-muted rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {isAllowed && (
                      <Link
                        href="/admin"
                        className="px-4 py-2 hover:bg-muted rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        resetCart();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogoutLink postLogoutRedirectURL="/">
                        Logout
                      </LogoutLink>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
