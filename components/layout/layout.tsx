"use client";

import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);

  React.useEffect(() => {
    if (pathname === "/pos") {
      setIsSidebarOpen(false);
    } 
    // else if (pathname === "/customer_support") {
    //   setIsSidebarOpen(false);

    // }
     else {
      setIsSidebarOpen(true);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      setLocked(newState);
      return newState;
    });
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed: isSidebarOpen,
        setCollapsed: toggleSidebar,
      }}
    >
      <section className="flex">
        {isSidebarOpen && <SidebarWrapper />}
        <NavbarWrapper>{children}</NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  );
};
