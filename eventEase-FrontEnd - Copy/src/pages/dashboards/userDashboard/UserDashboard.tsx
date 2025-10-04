import { useState } from 'react';
import { useUser } from '../../../stores/userStore';
import { Header } from '../../../components/dashboards/userDashboard/Header';
import { Sidebar } from '../../../components/dashboards/userDashboard/Sidebar';
import { Dashboard } from './sections/Dashboard';
import { AllEvents } from './sections/AllEvents';
import { CreateEvent } from './sections/CreateEvent';
import { Payments } from './sections/Payments';
import { Notifications } from './sections/Notifications';
import { Profile } from './sections/Profile';

export const UserDashboard = () => {
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
      case 'all-events':
        return <AllEvents />;
      case 'create-event':
        return <CreateEvent />;
      case 'payments':
        return <Payments />;
      case 'notifications':
        return <Notifications />;
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
