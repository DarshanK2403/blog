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

// Default export is the simple card so `import StatCard from "…"` works as expected.
export default StatCard;