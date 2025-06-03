
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/professional/dashboard/sections/DashboardHeader';
import StatsSection from '@/components/professional/dashboard/sections/StatsSection';
import DashboardMainContent from '@/components/professional/dashboard/sections/DashboardMainContent';
import { professionalData as sampleProfessionalData } from '@/data/professionalDashboardData';


const ProfessionalDashboardPage = () => {
  const { user, logout } = useAuth();

  const currentProfessionalData = user && user.role === 'professional' 
    ? { name: user.name, specialty: user.specialty || sampleProfessionalData.specialty, ...sampleProfessionalData } 
    : sampleProfessionalData;


  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <DashboardHeader 
          name={currentProfessionalData.name} 
          specialty={currentProfessionalData.specialty} 
        />

        <StatsSection 
          upcomingAppointments={currentProfessionalData.upcomingAppointments}
          newMessages={currentProfessionalData.newMessages}
          profileCompleteness={currentProfessionalData.profileCompleteness}
          activeSubscription={currentProfessionalData.activeSubscription}
        />
        
        <DashboardMainContent />
        
        <div className="mt-12 text-center">
            <Button variant="outline" onClick={logout} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <LogOut size={16} className="mr-2" />Cerrar Sesión
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboardPage;
