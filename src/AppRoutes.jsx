
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ProfessionalsPage from '@/pages/ProfessionalsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ContactPage from '@/pages/ContactPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import ProfessionalProfilePage from '@/pages/ProfessionalProfilePage';
import BlogPage from '@/pages/BlogPage';
// Admin Pages
import AdminLayout from '@/components/layout/AdminLayout'; // Import AdminLayout
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUserManagementPage from '@/pages/admin/AdminUserManagementPage';
import AdminSubscriptionManagementPage from '@/pages/admin/AdminSubscriptionManagementPage';
import AdminValidationPage from '@/pages/admin/AdminValidationPage';
import AdminCouponsPage from '@/pages/admin/AdminCouponsPage'; // Import AdminCouponsPage
// Professional Pages
import ProfessionalDashboardPage from '@/pages/professional/ProfessionalDashboardPage'; 
import ProfessionalAppointmentsPage from '@/pages/professional/ProfessionalAppointmentsPage';
import ProfessionalPatientsPage from '@/pages/professional/ProfessionalPatientsPage';
import ProfessionalMessagesPage from '@/pages/professional/ProfessionalMessagesPage';
import ProfessionalEditProfilePage from '@/pages/professional/ProfessionalEditProfilePage';
import ProfessionalAnalyticsPage from '@/pages/professional/ProfessionalAnalyticsPage';
import ProfessionalSettingsPage from '@/pages/professional/ProfessionalSettingsPage';
import ProfessionalSubscriptionPage from '@/pages/professional/ProfessionalSubscriptionPage';

import ComingSoonPage from '@/pages/ComingSoonPage.jsx';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Cargando...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} replace />; 
  }

  return children;
};


const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Inicializando aplicación...</p></div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profesionales" element={<ProfessionalsPage />} />
      <Route path="/profesional/:id" element={<ProfessionalProfilePage />} />
      
      <Route path="/login" element={user ? <Navigate to={user.role === 'professional' ? "/profesionales/dashboard" : (user.role === 'admin' ? "/admin/dashboard" : "/")} replace /> : <LoginPage />} />
      <Route path="/registro" element={user ? <Navigate to={user.role === 'professional' ? "/profesionales/dashboard" : (user.role === 'admin' ? "/admin/dashboard" : "/")} replace /> : <RegisterPage />} />
      
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/buscar" element={<SearchResultsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/mensajes" element={<ProtectedRoute><ComingSoonPage title="Mensajería Paciente/Admin" /></ProtectedRoute>} />


      {/* Professional Area Routes */}
      <Route 
        path="/profesionales/dashboard" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalDashboardPage /></ProtectedRoute>} 
      />
      <Route 
        path="/profesionales/citas" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalAppointmentsPage /></ProtectedRoute>} 
      />
      <Route 
        path="/profesionales/pacientes" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalPatientsPage /></ProtectedRoute>} 
      />
       <Route 
        path="/profesionales/perfil" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalEditProfilePage /></ProtectedRoute>} 
      />
       <Route 
        path="/profesionales/suscripcion" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalSubscriptionPage /></ProtectedRoute>} 
      />
       <Route 
        path="/profesionales/estadisticas" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalAnalyticsPage /></ProtectedRoute>} 
      />
      <Route 
        path="/profesionales/mensajes" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalMessagesPage /></ProtectedRoute>} 
      />
       <Route 
        path="/profesionales/configuracion" 
        element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalSettingsPage /></ProtectedRoute>} 
      />


      {/* Admin Area Routes */}
      <Route 
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUserManagementPage />} /> {/* Changed from /admin/usuarios to users */}
        <Route path="transactions" element={<AdminSubscriptionManagementPage />} /> {/* Changed from /admin/suscripciones to transactions */}
        <Route path="coupons" element={<AdminCouponsPage />} /> {/* Updated to AdminCouponsPage */}
        <Route path="validations" element={<AdminValidationPage />} /> {/* Path changed from /admin/validaciones */}
        <Route path="tickets" element={<ComingSoonPage title="Gestión de Tickets de Soporte" />} />
        <Route path="discounts" element={<ComingSoonPage title="Gestión de Códigos de Descuento" />} /> {/* Path changed from /admin/descuentos */}
        <Route path="settings" element={<ComingSoonPage title="Configuración General del Sitio" />} /> {/* Path changed from /admin/configuracion */}
      </Route>

      <Route path="/terminos" element={<ComingSoonPage title="Términos y Condiciones" />} />
      <Route path="/privacidad" element={<ComingSoonPage title="Política de Privacidad" />} />
      <Route path="/cookies" element={<ComingSoonPage title="Política de Cookies" />} />

      <Route path="*" element={<ComingSoonPage title="Página no encontrada (404)" />} />
    </Routes>
  );
};

export default AppRoutes;
