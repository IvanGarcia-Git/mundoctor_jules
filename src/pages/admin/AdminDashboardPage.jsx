
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, BarChart2, ShieldCheck, Ticket, Percent } from 'lucide-react';

const AdminDashboardPage = () => {
  const stats = [
    { title: "Usuarios Registrados", value: "1,250", icon: <Users className="text-blue-500" />, color: "blue" },
    { title: "Profesionales Activos", value: "350", icon: <Briefcase className="text-green-500" />, color: "green" },
    { title: "Suscripciones Activas", value: "280", icon: <BarChart2 className="text-purple-500" />, color: "purple" },
    { title: "Validaciones Pendientes", value: "15", icon: <ShieldCheck className="text-red-500" />, color: "red" },
  ];

  const quickLinks = [
    { name: 'Gestionar Usuarios', path: '/admin/usuarios', icon: <Users size={20}/> },
    { name: 'Validar Profesionales', path: '/admin/validaciones', icon: <ShieldCheck size={20}/> },
    { name: 'Ver Suscripciones', path: '/admin/suscripciones', icon: <Briefcase size={20}/> },
    { name: 'Gestionar Tickets Soporte', path: '/admin/tickets', icon: <Ticket size={20}/> },
    { name: 'Crear Códigos Descuento', path: '/admin/descuentos', icon: <Percent size={20}/> },
  ];

  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground dark:text-gray-400">Bienvenido al centro de control de Mundoctor.</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map(stat => (
            <div key={stat.title} className={`bg-card dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-xl border border-border dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow`}>
              <div className={`p-3 inline-block bg-${stat.color}-500/10 rounded-lg mb-3`}>
                {React.cloneElement(stat.icon, { size: 28 })}
              </div>
              <h3 className="text-2xl font-bold text-foreground dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{stat.title}</p>
            </div>
          ))}
        </section>

        {/* Quick Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="bg-card dark:bg-gray-800/60 backdrop-blur-md p-5 rounded-lg border border-border dark:border-gray-700/50 shadow-md hover:border-primary dark:hover:border-blue-500 transition-colors flex items-center space-x-3"
              >
                {React.cloneElement(link.icon, { className: 'text-primary dark:text-blue-400' })}
                <span className="text-foreground dark:text-white font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Placeholder for recent activity or charts */}
        <section>
            <h2 className="text-2xl font-semibold mb-6">Actividad Reciente (Platzhalter)</h2>
            <div className="bg-card dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-xl border border-border dark:border-gray-700/50 shadow-lg">
                <p className="text-muted-foreground dark:text-gray-400">Aquí se mostraría un resumen de la actividad reciente, como nuevos registros, suscripciones, o validaciones completadas. También podrían incluirse gráficos de tendencias.</p>
                <div className="mt-6 h-64 bg-muted/30 dark:bg-gray-700/30 rounded-md flex items-center justify-center">
                    <BarChart2 size={48} className="text-muted-foreground/50 dark:text-gray-600"/>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
