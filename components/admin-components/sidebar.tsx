"use client";
import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { SidebarProps } from "@/types";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, menuItems }) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubMenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        top-36 h-[calc(100vh-8rem)] lg:top-0 lg:h-full lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                src="/icon-superadmin.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-12 h-10"
              />
            </div>
            <div className="ml-3">
              <h2 className="text-gray-900 text-lg font-bold font-italic">
                Superadmin
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.id);

            return (
              <div key={item.id}>
                <div className="relative">
                  <Link
                    href={item.href}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      isActive
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 flex-shrink-0 h-5 w-5">
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center">
                      {item.badge && (
                        <span className="ml-3 inline-block py-0.5 px-2 text-xs bg-red-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  {hasChildren && (
                    <button
                      onClick={(e) => toggleSubMenu(item.id, e)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-200 focus:outline-none"
                      aria-label={`Toggle ${item.label} submenu`}
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>

                {hasChildren && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`block px-2 py-1 rounded-md text-sm ${
                            isChildActive
                              ? "bg-gray-200 text-gray-900"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">Admin Panel v1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;