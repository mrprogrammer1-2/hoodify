"use client";

import Link from "next/link";
import Image from "next/image";
import { TableOfContents } from "lucide-react";
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

export default function Nav() {
  const { user, isAuthenticated, getPermission, isLoading } =
    useKindeBrowserClient();
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const isAllowed = !isLoading && getPermission("admin:allowed")?.isGranted;

  useEffect(() => {
    setMounted(true);
  }, []);

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

        <div className="flex gap-5 items-center">
          {!mounted ? (
            <>
              <Button disabled>Loading...</Button>
            </>
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
            <>
              <Button onClick={() => resetCart()}>
                <LogoutLink postLogoutRedirectURL="/">Logout</LogoutLink>
              </Button>
              <span>
                {user?.given_name} {user?.family_name}
              </span>
              {isAllowed && (
                <Button>
                  <Link href="/admin">Dashboard</Link>
                </Button>
              )}
            </>
          )}

          <CartIcon />
          <ModeToggle />
          <TableOfContents />
        </div>
      </nav>
    </header>
  );
}
