
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'all-events', label: 'All Events', icon: '📅' },
    { id: 'create-event', label: 'Create Event', icon: '➕' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-100 via-purple-50 to-pink-50 text-gray-700 min-h-screen relative overflow-hidden border-r border-purple-200">
      {/* Reduced Floating Decorative Elements */}
      <div className="absolute top-4 left-4 text-sm animate-bounce opacity-20" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-8 right-6 text-sm animate-bounce opacity-20" style={{ animationDelay: '2.5s' }}>⭐</div>
      
      <nav className="mt-8 relative z-10">
        <ul className="space-y-2 px-4">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-purple-200 text-purple-800 shadow-sm border border-purple-300'
                    : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
