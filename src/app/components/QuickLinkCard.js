// components/QuickLinkCard.jsx
import Link from "next/link";

export const QuickLinkCard = ({ href, label, icon: Icon }) => {
  return (
    <Link
      href={href}
      className=" bg-white p-4 shadow-sm flex items-center gap-3
                 text-sm font-medium text-gray-700 hover:bg-gray-50 transition group"
    >
      <Icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
      <span>{label}</span>
    </Link>
  );
};
