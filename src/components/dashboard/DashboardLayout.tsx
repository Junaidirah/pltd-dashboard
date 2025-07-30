"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [selectedStation, setSelectedStation] = useState("all"); // default "Semua Stasiun"
  const router = useRouter();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);

    switch (itemId) {
      case "input":
        router.push("/input");
        break;
      case "dashboard":
        router.push("/dashboard");
        break;
      case "history":
        router.push("/history");
        break;
      case "hasil-input":
        router.push("/hasil-input");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <main className="flex-1 overflow-auto lg:ml-0 p-4">
        {/* Pass down selectedStation dan setSelectedStation via props, context, atau langsung ke children */}
        {children}
      </main>
    </div>
  );
}
