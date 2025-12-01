"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "@phosphor-icons/react";
import { getSupabase } from "@/config/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface SidebarProps {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const supabase = getSupabase();
  const router = useRouter();
  type IconName = keyof typeof Icons;

  const nav: { id: string; label: string; icon: IconName; href: string }[] = [
    { id: "home", label: "Home", icon: "House", href: "/dashboard/home" },
    { id: "hero", label: "Hero", icon: "Sparkle", href: "/dashboard/hero" },
    {
      id: "projects",
      label: "Projects",
      icon: "Code",
      href: "/dashboard/projects",
    },
    {
      id: "services",
      label: "Services",
      icon: "Suitcase",
      href: "/dashboard/services",
    },
    {
      id: "experiences",
      label: "Experiences",
      icon: "GraduationCap",
      href: "/dashboard/experiences",
    },
    {
      id: "testimonial",
      label: "Testimonial",
      icon: "ChatCenteredDots",
      href: "/dashboard/testimonial",
    },
    {
      id: "about-me",
      label: "About Me",
      icon: "UserCircle",
      href: "/dashboard/about-me",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "Gear",
      href: "/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Logout failed", { position: "top-right" });
        setLoggingOut(false);
        return;
      }

      toast.success("Logged out successfully", { position: "top-right" });
      router.push("/");
    } catch (err) {
      toast.error("Something went wrong", { position: "top-right" });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`flex flex-col transition-[width,box-shadow] duration-300 bg-white shadow-sm border-r overflow-hidden ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setCollapsed((s) => !s)}
          aria-expanded={!collapsed}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {!collapsed ? (
            <Icons.CaretDoubleLeft size={20} weight="bold" color="#8B5CF6" />
          ) : (
            <Icons.CaretDoubleRight size={20} weight="bold" color="#8B5CF6" />
          )}
        </button>

        <div
          className={`flex items-center gap-2 transition-all ${
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#8B5CF6] text-white">
            <Icons.Rocket size={16} weight="bold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Portfolio CMS</p>
            <p className="text-xs text-slate-400">Welcome back</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-2">
        <ul className="space-y-1">
          {nav.map((item) => {
            const IconComp = Icons[item.icon] as React.ElementType;

            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`group w-full flex items-center gap-3 py-2 px-3 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-[#8B5CF6] ring-1 ring-indigo-100"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <IconComp size={20} weight={isActive ? "fill" : "regular"} />

                  {!collapsed && <span>{item.label}</span>}

                  {collapsed && isActive && (
                    <span className="ml-auto w-1 h-6 bg-[#8B5CF6] rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="p-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-full flex items-center gap-3 py-2 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 text-slate-700 cursor-pointer ${
              collapsed ? "justify-center" : "justify-start"
            }`}
          >
            {loggingOut ? (
              <div className="animate-spin h-5 w-5 border-b-2 border-gray-500 rounded-full"></div>
            ) : (
              <Icons.Power size={20} color="red" className="font-bold" />
            )}

            {!collapsed && (
              <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4">
        <button
          onClick={() => alert("Sign out placeholder")}
          className={`w-full flex items-center gap-3 py-2 px-3 rounded-md text-sm hover:bg-slate-50 ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <Icons.SignOut size={20} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
