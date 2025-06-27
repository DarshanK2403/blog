import Link from 'next/link';

const orgs = [
  "SSC", "UPSC", "GPSC", "OJAS", "IBPS",
  "Railway", "Defense", "Police", "Forest", "Teacher",
  "Clerk", "Banking", "High Court", "Judiciary", "Technical"
];

export default function Sidebar() {
  return (
    <aside className="bg-gray-900 space-y-2">
      {orgs.map((org) => (
        <Link
          key={org}
          href={`/organization/${org.toLowerCase()}`}
          className="block text-white px-3 py-2 text-sm hover:bg-gray-800"
        >
          {org}
        </Link>
      ))}
    </aside>
  );
}
