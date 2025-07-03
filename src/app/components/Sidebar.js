import Link from "next/link";

const orgs = [
  "SSC", "UPSC", "GPSC", "OJAS", "IBPS",
  "Railway", "Defense", "Police", "Forest", "Teacher",
  "Clerk", "Banking", "High Court", "Judiciary", "Technical"
];

export default function Sidebar() {
  return (
    <aside className="h-full bg-[#13293D] text-[#FDFDFD] px-4 py-6 space-y-4 font-sans">
      {/* Sidebar heading */}
      <h2 className="text-lg font-semibold !text-white mb-4 pb-2">
        Quick Links
      </h2>

      {/* Organization links */}
      <div className="space-y-2">
        {orgs.map((org, index) => (
          <div key={org}>
            <Link
              href={`/organization/${org.toLowerCase()}`}
              className="block text-sm text-white px-2 py-1 hover:bg-gray-800 rounded"
            >
              {org}
            </Link>

            {/* Divider below each link except the last one */}
            {index !== orgs.length - 1 && (
              <hr className="border-gray-700 my-1" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
