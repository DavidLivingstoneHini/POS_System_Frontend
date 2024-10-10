import { Input, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import Image from "next/image"; // Import the Image component
import { AiOutlineArrowLeft } from "react-icons/ai";
import { SupportIcon } from "../icons/navbar/support-icon";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

interface Props {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/": "",
  "/pos": "Point of Sale",
  // TODO: Add other routes and their titles here
};

export const NavbarWrapper = ({ children }: Props) => {
  const pathname = usePathname();
  const currentPageTitle = pageTitles[pathname] || "";

  const isPosPage = pathname === "/pos";
  const isHomePage = pathname === "/";

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full bg-gradient-to-r from-purple-800 to-black" // Updated darker gradient
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        {isPosPage && (
          <NavbarContent className="flex items-center">
            <NextLink
              href="/"
              className="hidden md:flex items-center gap-2 border border-gray-800 rounded-full p-[8px] transition duration-300 ease-in-out hover:bg-gray-700"
              title="Back to Home"
            >
              <div className="flex justify-center items-center bg-gray-800 rounded-full p-[2px] transition-transform duration-300 ease-in-out hover:scale-110">
                <AiOutlineArrowLeft color="white" size={18} />
              </div>
              <span className="font-semibold text-white text-[14.5px] hidden">
                Back to Home
              </span>
            </NextLink>
          </NavbarContent>
        )}

        {!isHomePage && (
          <NavbarContent className="flex justify-center flex-grow">
            <div className="bg-gradient-to-r from-blue-100 to-red-200 border border-gray-300 rounded-lg shadow-lg p-3 max-w-fit">
              <span className="text-[16px] font-semibold text-gray-700 flex flex-row">
                <Image
                  src="/posicon.png"
                  alt="Point of Sale Icon"
                  width={26}
                  height={25}
                  className="mr-2" 
                />
                {currentPageTitle}
              </span>
            </div>
          </NavbarContent>
        )}

        {isHomePage && (
          <NavbarContent className="w-full max-md:hidden">
            <Input
              startContent={<SearchIcon />}
              isClearable
              className="w-full"
              classNames={{
                input: "w-full",
                mainWrapper: "w-full",
              }}
              placeholder="Search..."
            />
          </NavbarContent>
        )}

        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>

        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <NotificationsDropdown />

          <div className="max-md:hidden">
            <SupportIcon />
          </div>

          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
