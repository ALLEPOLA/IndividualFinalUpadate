
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'my-services', label: 'My Services', icon: '📅' },
    { id: 'bookings', label: 'Bookings', icon: '➕' },
    { id: 'team-management', label: 'Team Management', icon: '💳' },
    { id: 'analytics', label: 'Analytics', icon: '👤' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
