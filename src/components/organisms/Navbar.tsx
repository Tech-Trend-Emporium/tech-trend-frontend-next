"use client";

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button as FBButton, Badge } from "flowbite-react";
import { Logo, Button } from "../../components/atoms";
import { SearchBar } from "../molecules";
import { LogoutButton } from "../atoms/LogoutButton";
import { useAuth } from "../../auth/AuthProvider";
import { IoMdCart } from "react-icons/io";
import { userNameFromToken, roleFromToken } from "../../services";
import { useRouter } from "next/navigation";
import { useMounted } from "@/src/hooks/useMounted";


type Props = { cartCount?: number };

export const NavbarComponent = ({ cartCount = 0 }: Props) => {
  const router = useRouter();
  const { auth } = useAuth();
  const mounted = useMounted();

  const username = mounted ? userNameFromToken(auth) : "";
  const role = mounted ? roleFromToken(auth) : undefined;

  const showAuthed = mounted && auth.isAuthenticated;

  return (
    <>
      <style>{`
        .navbar-link-custom {
          color: rgb(75, 85, 99) !important;
          transition: all 0.2s ease !important;
        }
        
        .dark .navbar-link-custom {
          color: rgb(209, 213, 219) !important;
        }
        
        .navbar-link-custom:hover {
          color: rgb(17, 24, 39) !important;
          background-color: rgb(243, 244, 246) !important;
        }
        
        .dark .navbar-link-custom:hover {
          color: rgb(255, 255, 255) !important;
          background-color: rgb(55, 65, 81) !important;
        }
        
        .cart-button:hover {
          background-color: rgb(243, 244, 246) !important;
        }
        
        .dark .cart-button:hover {
          background-color: rgb(55, 65, 81) !important;
        }
      `}</style>

      <Navbar fluid className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5">
        <NavbarBrand href="/">
          <Logo className="mr-3 w-9 h-6 sm:h-9 hidden dark:block" text="white" />
          <Logo className="mr-3 w-9 h-6 sm:h-9 block dark:hidden" text="black" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Tech Trend Emporium
          </span>
        </NavbarBrand>

        <div className="flex md:order-2 items-center gap-2" suppressHydrationWarning>
          {!showAuthed ? (
            <Button href="/sign-in" variant="outline" size="sm">
              Login
            </Button>
          ) : (
            <>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2">
                {role === "SHOPPER" ? "User" : role === "EMPLOYEE" ? "Employee" : "Admin"}
                {username ? ` · ${username}` : ""}
              </span>

              {role === "SHOPPER" && (
                <FBButton pill color="gray" size="sm" className="relative hover:cursor-pointer">
                  <IoMdCart className="h-4 w-4" />
                  <Badge className="absolute -top-1.5 -right-1.5 text-[0.75rem] leading-none rounded-full px-1.5 py-1 bg-blue-600 text-white">
                    {cartCount}
                  </Badge>
                </FBButton>
              )}

              {(role === "EMPLOYEE" || role === "ADMIN") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:opacity-90 hover:bg-blue-800! hover:cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  Employee Portal
                </Button>
              )}

              <LogoutButton />
            </>
          )}
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <div className="flex items-center gap-4">
            <NavbarLink href="/favorites">Favorites</NavbarLink>
            {showAuthed && role === "SHOPPER" && (
              <>
                <NavbarLink href="#">ShopList</NavbarLink>
                <NavbarLink href="#">Wishlist</NavbarLink>
              </>
            )}
            <SearchBar />
          </div>
        </NavbarCollapse>
      </Navbar>
    </>
  );
};