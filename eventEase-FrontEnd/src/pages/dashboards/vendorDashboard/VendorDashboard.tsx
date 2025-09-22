import { useState } from 'react';
import { useUser } from '../../../stores/userStore';
import { Sidebar } from '../../../components/dashboards/vendorDashboard/Sidebar';
import { Header } from '../../../components/dashboards/vendorDashboard/Header';
import { Dashboard } from './sections/Dashboard';
import { MyServices } from './sections/MyServices';
import { Bookings } from './sections/Bookings';
import { TeamManagement } from './sections/TeamManagement';
import { Analytics } from './sections/Analytics';
import { Profile } from './sections/Profile';

export const VendorDashboard = () => {
  const user = useUser();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-services':
        return <MyServices />;
      case 'bookings':
        return <Bookings />;
      case 'team-management':
        return <TeamManagement />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};
