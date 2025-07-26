"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard, { DropStatsCard } from "@/app/components/StatCard";
import { QuickLinkCard } from "@/app/components/QuickLinkCard";

// Lucide icons
import { FilePlus, Layers, Building, FolderPlus } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="m-2 grid grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-100 h-24" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="m-4 text-sm text-red-600">Couldn’t load dashboard data.</p>;
  }

  const quickLinks = [
    { href: "/admin/posts/new", label: "Create Post", icon: FilePlus },
    { href: "/admin/post-type/new", label: "Create PostType", icon: Layers },
  ];

  return (
    <div className="m-2 space-y-6">
      {/* Row 1: Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Posts" value={stats.total} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Draft" value={stats.draft} />
      </div>

      {/* Row 2: Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-2">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.href} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
}
