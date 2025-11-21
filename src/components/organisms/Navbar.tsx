"use client";

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button as FBButton, Badge } from "flowbite-react";
import { Logo, Button } from "../../components/atoms";
import { SearchBar } from "../molecules";
import { LogoutButton } from "../atoms/LogoutButton";
import { IoMdCart } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useIdentity, useMounted, useSearchBar } from "@/src/hooks";


type Props = { cartCount?: number };

export const NavbarComponent = ({ cartCount = 0 }: Props) => {
  const router = useRouter();
  const mounted = useMounted();
  const { isAuthenticated, role, username } = useIdentity();
  const { handleSearchChange, handleSearchSubmit, handleSuggestionClick, searchValue, suggestions } = useSearchBar();

  const roleLabel =
    role === "SHOPPER" ? "User" :
    role === "EMPLOYEE" ? "Employee" :
    role === "ADMIN" ? "Admin" :
    "";

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
          {!isAuthenticated ? (
            <Button href="/sign-in" variant="outline" size="sm">
              Login
            </Button>
          ) : (
            <>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 mr-2"
                suppressHydrationWarning
              >
                {roleLabel}{username ? ` · ${username}` : ""}
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
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/admin")}
                >
                  {role === "EMPLOYEE" ? "Employee" : "Admin"} Portal
                </Button>
              )}

              <LogoutButton />
            </>
          )}
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <div className="flex items-center gap-4">
            {isAuthenticated && role === "SHOPPER" && (
              <>
                <NavbarLink href="/favorites">Favorites</NavbarLink>
                <NavbarLink href="/shoplist">Shoplist</NavbarLink>
                <NavbarLink href="/wishlist">Wishlist</NavbarLink>

                <span className="relative w-full max-w-xs">
                  <SearchBar 
                    placeholder="Search products"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute mt-2 bg-white dark:bg-gray-800 p-3 rounded-md shadow-md">
                      {suggestions.map((s) => (
                        <li
                          key={s.id}
                          className="cursor-pointer py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          onClick={() => handleSuggestionClick(s.id)}
                        >
                          {s.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </span>
              </>
            )}
            {mounted && !isAuthenticated && (
              <>
                <NavbarLink href="/favorites">Favorites</NavbarLink>

                <span className="relative w-full max-w-xs">
                  <SearchBar 
                    placeholder="Search products"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute mt-2 bg-white dark:bg-gray-800 p-3 rounded-md shadow-md">
                      {suggestions.map((s) => (
                        <li
                          key={s.id}
                          className="cursor-pointer py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          onClick={() => handleSuggestionClick(s.id)}
                        >
                          {s.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </span>
              </>
            )}
          </div>
        </NavbarCollapse>
      </Navbar>
    </>
  );
};