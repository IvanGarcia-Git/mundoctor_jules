import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ArrowRightLeft, TicketPercent, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui is used

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Usuarios' },
    { href: '/admin/transactions', icon: ArrowRightLeft, label: 'Transacciones' },
    { href: '/admin/coupons', icon: TicketPercent, label: 'Cupones' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <Link to="/admin/dashboard" className="flex items-center text-white">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto mr-2" /> {/* Replace with your logo */}
          <span className="text-xl font-semibold">Admin Panel</span>
        </Link>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => isMobileMenuOpen && toggleMobileMenu()}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${
          isSidebarOpen ? 'md:w-64' : 'md:w-20'
        } hidden md:flex md:flex-col`}
      >
        <SidebarContent />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -right-5 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full hidden md:block"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <SidebarContent />
      </aside>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} md:ml-0`}>
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
            <span className="text-lg font-semibold">Admin</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {/* TODO: Consider adding a global Toast/Notification provider here for API feedback */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
