
import React from 'react';
import StatCard from '@/components/professional/dashboard/StatCard';

const StatsSection = ({ upcomingAppointments, newMessages, profileCompleteness, activeSubscription }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard title="Citas Próximas" value={upcomingAppointments} iconName="CalendarDays" iconColor="blue" />
      <StatCard title="Mensajes Nuevos" value={newMessages} iconName="MessageSquare" iconColor="green" />
      <StatCard title="Perfil Completo" value={`${profileCompleteness}%`} iconName="UserCircle" iconColor="purple" />
      <StatCard title="Suscripción" value={activeSubscription} iconName="CreditCard" iconColor="yellow" />
    </section>
  );
};

export default StatsSection;
