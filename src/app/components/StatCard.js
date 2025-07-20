import React, { useEffect, useRef, useState } from "react";

/**
 * Shared base classes so every card aligns neatly in a grid.
 * min‑h keeps all cards the same height; overlay dropdowns won’t push siblings.
 */
const baseCardClasses =
  "bg-white p-4 shadow-sm flex flex-col gap-1 min-h-[96px]";

/**
 * StatCard – simple label → value card.
 *
 * @example
 * <StatCard label="Total Users" value={128} />
 */
export const StatCard = ({ label, value, className = "" }) => {
  return (
    <div className={`${baseCardClasses} ${className}`.trim()}>
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-2xl font-semibold text-gray-900 leading-none">
        {value}
      </span>
    </div>
  );
};

/**
 * DropStatsCard – collapsible variant that shows extra rows in an absolutely‑
 * positioned dropdown so the grid layout stays intact.
 *
 * Props
 *   totalOrg: number
 *   postsPerOrg: Array<{ orgId, organization, count }>
 *   className?: string
 */
export const DropStatsCard = ({ totalOrg, postsPerOrg = [], className = "" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (open && containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className={`${baseCardClasses} relative ${className}`.trim()}>
      {/* Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-500">Total Organisations</span>
          <span className="text-2xl font-semibold text-gray-900 leading-none">{totalOrg}</span>
        </div>
        {/* Arrow */}
        <svg
          className={`h-5 w-5 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute left-0 top-full mt-2 w-full bg-white shadow-lg border p-3 space-y-1 z-10 max-h-60 overflow-y-auto">
          {postsPerOrg.length ? (
            postsPerOrg.map((item) => (
              <li
                key={item.orgId || item.organization}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>{item.organization}</span>
                <span className="font-medium">{item.count}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic text-sm">No data</li>
          )}
        </ul>
      )}
    </div>
  );
};

// Default export is the simple card so `import StatCard from "…"` works as expected.
export default StatCard;

// Optional named re‑exports for convenience.
export { DropStatsCard as CollapsibleStatCard };