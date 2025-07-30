"use client";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  History,
  FileInput as Input,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "input",
    label: "Input",
    icon: Input,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    active: true,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
  {
    id: "hasil-input",
    label: "Hasil Input",
    icon: FileText,
  },
];

export default function Sidebar({
  activeItem = "dashboard",
  onItemClick,
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Determine active item based on current path
  const getCurrentActiveItem = () => {
    if (pathname === "/input") return "input";
    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/history") return "history";
    if (pathname === "/hasil-input") return "hasil-input";
    return "dashboard";
  };

  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col z-40 transition-transform duration-300 ease-in-out",
          "w-64 lg:w-64",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-11 lg:p-6 border-b border-blue-300/20 mt-12 lg:mt-0">
          <div className="flex items-center">
            <div className="w-[120px] h-[120px] rounded-lg overflow-hidden flex items-center justify-center shadow-lg">
              <Image
                src="/images/PLN.png"
                alt="Logo PLN"
                width={50}
                height={120}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 lg:py-6">
          <ul className="space-y-1 lg:space-y-2 px-3 lg:px-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = getCurrentActiveItem() === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 text-left text-sm lg:text-base",
                      isActive
                        ? "bg-yellow-400 text-blue-900 font-semibold shadow-lg"
                        : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
