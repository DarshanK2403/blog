const Sidebar = () => {
  const orgs = [
    "SSC", "UPSC", "GPSC", "OJAS", "IBPS",
    "Railway", "Defense", "Police", "Forest", "Teacher",
    "Clerk", "Banking", "High Court", "Judiciary", "Technical"
  ];

  return (
    <aside
      className="bg-gray-900 text-white font-sans w-full md:w-60 md:h-screen overflow-y-auto shadow-md"
      aria-label="Organization navigation"
    >
      <ul className="space-y-1 md:space-y-2 py-4 md:py-6 px-4">
        {orgs.map((org) => (
          <li
            key={org}
            className="cursor-pointer px-3 py-2 text-sm md:text-base rounded-md hover:bg-gray-800/70 transition-colors"
          >
            {org}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
