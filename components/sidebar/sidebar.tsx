import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0 flex">
      {collapsed && (
        <div
          className={Sidebar.Overlay()}
          onClick={() => setCollapsed(false)}
        />
      )}
      <div className={Sidebar({ collapsed })}>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {/* Logo Section */}
            <div className="relative mb-6 bg-gray-100 rounded-lg p-6">
              <div className="flex items-center gap-y-4 justify-center">
                <img
                  src="./favicon.png"
                  alt="Logo"
                  className="w-[28px] h-[24px] rounded-[100px] mr-2 border-1 border-white"
                />
                <h2 className="text-[17px] text-red-600 font-bold">
                  Kamakz ERP
                </h2>
              </div>
            </div>
            <SidebarItem
              title="Overview"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Home">
              <SidebarItem
                isActive={pathname === "/pos"}
                title="POS"
                icon={<AccountsIcon />}
                href="pos"
              />
              <SidebarItem
                isActive={pathname === "/customers"}
                title="HR & Payroll"
                icon={<CustomersIcon />}
              />
              <SidebarItem
                isActive={pathname === "/products"}
                title="Inventory"
                icon={<ProductsIcon />}
              />
              <SidebarItem
                isActive={pathname === "/reports"}
                title="CRM"
                icon={<ReportsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === "/developers"}
                title="Help"
                icon={<DevIcon />}
              />
              <SidebarItem
                isActive={pathname === "/view"}
                title="Favorites"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Profile"} color="primary">
              <Avatar src="https://i.pravatar.cc/400?img=46" size="sm" />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
