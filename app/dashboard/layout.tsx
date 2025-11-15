"use client";
import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState("home");
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar  />
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto py-6 border border-y-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
