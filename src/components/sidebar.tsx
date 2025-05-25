"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebarPage";
import {
  IconHome,
  IconUser,
  IconMessage,
  IconHeart,
  IconFileText,
  IconUsers,
  IconSearch,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
        <IconMessage className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
    {
      label: "Matches",
      href: "/matches",
      icon: (
        <IconHeart className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
    {
      label: "Survey",
      href: "/survey",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
    {
      label: "All Clubs",
      href: "/all-clubs",
      icon: (
        <IconSearch className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
    {
      label: "Your Clubs",
      href: "/your-clubs",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-none flex-1 flex-col overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 md:flex-row dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white/80 backdrop-blur-sm border-r border-purple-200">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-lg transition-all duration-200",
                      isActive &&
                        "bg-gradient-to-r from-purple-100 to-pink-100 shadow-sm"
                    )}
                  >
                    <SidebarLink
                      link={link}
                      className={cn(!open && "!justify-center")}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Sign Out",
                href: "/login",
                icon: (
                  <IconLogout className="h-5 w-5 shrink-0 text-purple-900 dark:text-purple-400" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}

// Update Logo with Venus purple theme
export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-r from-pink-400 to-purple-500" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
      >
        clubPal
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-r from-pink-400 to-purple-500" />
    </Link>
  );
};
