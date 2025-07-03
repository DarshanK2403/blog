"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Building2,
  Users,
  Settings,
  Bell,
  BarChart3,
  Tag,
  MessageSquare,
  Image,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Shapes,
  Layers,
  Puzzle,
  Columns,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    posts: false,
    categories: false,
    organization: false,
  });
  const pathname = usePathname();
  const router = useRouter();

  const toggleSection = (section) => {
    if (!isCollapsed) {
      setExpandedSections((prev) => {
        const isAlreadyOpen = prev[section];
        // Close all, open only clicked one (unless already open, then toggle)
        const newState = Object.fromEntries(
          Object.keys(prev).map((key) => [key, false])
        );
        return { ...newState, [section]: !isAlreadyOpen };
      });
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "posts",
      label: "Posts",
      icon: FileText,
      expandable: true,
      subItems: [
        {
          id: "all-posts",
          label: "All Posts",
          icon: Eye,
          path: "/admin/posts",
        },
        {
          id: "add-post",
          label: "Add New Post",
          icon: PlusCircle,
          path: "/admin/posts/new",
        },
        {
          id: "drafts",
          label: "Drafts",
          icon: Edit,
          path: "/admin/posts/drafts",
        },
        {
          id: "published",
          label: "Published",
          icon: FileText,
          path: "/admin/posts/published",
        },
      ],
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderOpen,
      path: "/admin/categories",
    },
    {
      id: "organization",
      label: "Organization",
      icon: Building2,
      path: "/admin/organization",
    },
    
        {
          id: "post-type",
          label: "Post Type",
          icon: Shapes,
          path: "/admin/post-type",
        },
        {
          id: "extra-fields",
          label: "Extra Fields",
          icon: Puzzle,
          path: "/admin/extra-fields",
        },
    {
      id: "media",
      label: "Media Library",
      icon: Image,
      path: "/admin/media",
    },
    {
      id: "comments",
      label: "Comments",
      icon: MessageSquare,
      path: "/admin/comments",
      badge: "12",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
  ];

  const bottomMenuItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/admin/notifications",
      badge: "3",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      path: "/logout",
      className:
        "text-red-400 hover:text-red-300 hover:bg-red-900/20 hover:shadow-lg hover:border-red-400",
    },
  ];

  const MenuItem = ({ item, isSubItem = false }) => {
    const Icon = item.icon;
    const isRouteActive = pathname === item.path; // Using Next.js usePathname
    const isActive = activeItem === item.id || isRouteActive;
    const isExpanded = expandedSections[item.id];

    return (
      <div className="mb-0">
        <div
          onClick={() => {
            if (item.expandable && !isCollapsed) {
              toggleSection(item.id);
            }
            if (!item.expandable && item.path) {
              setActiveItem(item.id);
              router.push(item.path);
            }
          }}
          className={`
            flex items-center justify-between ${
              isCollapsed ? "px-4 justify-center" : "px-6"
            } py-3 cursor-pointer transition-all duration-300 border-r-4 relative group
            ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md border-transparent hover:border-gray-700"
            }
            ${isSubItem && !isCollapsed ? "pl-12 text-sm bg-gray-800/50" : ""}
            ${isSubItem && isCollapsed ? "hidden" : ""}
            ${item.className || ""}
          `}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <Icon size={18} />
            {!isCollapsed && (
              <>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 shadow-lg animate-pulse">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>
          {!isCollapsed && item.expandable && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 border border-gray-700">
              {item.label}
              {item.badge && (
                <span className="ml-2 bg-red-500 text-xs px-1 py-0.5">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </div>

        {!isCollapsed && item.expandable && item.subItems && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-800/30 ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="transform transition-transform duration-300 ease-in-out">
              {item.subItems.map((subItem, index) => (
                <div
                  key={subItem.id}
                  className="transform transition-all duration-300 ease-in-out"
                  style={{
                    transitionDelay: isExpanded ? `${index * 0}ms` : "0ms",
                  }}
                >
                  <MenuItem item={subItem} isSubItem={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-max min-h-screen  ${
        isCollapsed ? "w-16" : "w-64"
      } bg-gray-900 border-r border-gray-800 flex flex-col shadow-xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={18} />
            </div>
            {!isCollapsed && (
              <div className="text-white">
                <h2 className="text-lg font-bold !text-white text-nowrap">
                  Yuva Gujarat
                </h2>
                <p className="text-xs !text-gray-200">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-300"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
        <div>
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div>
          {bottomMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/30">
        {isCollapsed ? (
          <div className="flex justify-center relative group">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md">
              <User size={16} className="text-gray-300" />
            </div>
            {/* Tooltip for collapsed user */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 border border-gray-700">
              John Doe - Admin
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md">
              <User size={16} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-400 truncate">Admin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
