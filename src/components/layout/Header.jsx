
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X, Search, Home, Stethoscope, Phone, LogIn, UserPlus, Bell, MessageCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsDropdown from '@/components/layout/NotificationsDropdown';
import MessagesDropdown from '@/components/layout/MessagesDropdown'; // Importado

const navLinks = [
  { name: 'Inicio', path: '/', icon: <Home size={18} />, exact: true },
  { name: 'Profesionales', path: '/profesionales', icon: <Stethoscope size={18} />, exact: true },
  { name: 'Buscar', path: '/buscar', icon: <Search size={18} />, exact: false },
  { name: 'Contacto', path: '/contacto', icon: <Phone size={18} />, exact: true },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton && mobileMenuButton.contains(event.target)) {
          return; 
        }
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);


  const handleLogout = () => {
    closeMobileMenu();
    logout(navigate);
  };
  
  const NavItem = ({ path, name, icon, onClick, exact }) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    return (
      <NavLink
        to={path}
        onClick={onClick}
        className={
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
          ${isActive ? 'bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-300' 
                    : 'text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white hover:bg-muted/50 dark:hover:bg-gray-700/50'}`
        }
      >
        {icon && React.cloneElement(icon, { className: 'mr-2' })}
        {name}
      </NavLink>
    );
  };

  const MobileNavItem = ({ path, name, icon, onClick, exact }) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    return (
     <NavLink
      to={path}
      onClick={onClick}
      className={
        `flex items-center w-full px-4 py-3 text-base font-medium transition-colors duration-200
        ${isActive ? 'bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-300' 
                  : 'text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white hover:bg-muted/50 dark:hover:bg-gray-700/50'}`
      }
    >
      {icon && React.cloneElement(icon, { className: 'mr-3' })}
      {name}
    </NavLink>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-gray-800/40 dark:bg-slate-900/75">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Logo className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => (
              <NavItem key={link.name} {...link} />
            ))}
             {user && user.role === 'admin' && (
              <NavItem key="admin-dashboard" path="/admin/dashboard" name="Admin" icon={<LayoutDashboard size={18}/>} exact={false} />
            )}
            {user && user.role === 'professional' && (
              <NavItem key="prof-dashboard" path="/profesionales/dashboard" name="Mi Panel" icon={<LayoutDashboard size={18}/>} exact={false} />
            )}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2"> {/* Ajustado space-x */}
            {user && (
              <>
                <NotificationsDropdown />
                <MessagesDropdown /> {/* Añadido MessagesDropdown */}
              </>
            )}
            {/* <ThemeToggle /> */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                 <Button onClick={handleLogout} variant="outline" size="sm">
                   <LogOut size={16} className="mr-1.5" /> Cerrar Sesión
                 </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Link to="/login"><LogIn size={16} className="mr-1.5" /> Iniciar Sesión</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/registro"><UserPlus size={16} className="mr-1.5" /> Registrarse</Link>
                </Button>
              </div>
            )}
            <Button
              id="mobile-menu-button"
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border/40 dark:border-gray-800/40 bg-background dark:bg-slate-900 absolute w-full shadow-xl"
          >
            <nav className="flex flex-col space-y-1 p-4">
              {navLinks.map(link => (
                <MobileNavItem key={link.name} {...link} onClick={closeMobileMenu} />
              ))}
              {user && user.role === 'admin' && (
                <MobileNavItem key="admin-dashboard-mobile" path="/admin/dashboard" name="Admin Panel" icon={<LayoutDashboard size={18}/>} onClick={closeMobileMenu} exact={false} />
              )}
              {user && user.role === 'professional' && (
                <MobileNavItem key="prof-dashboard-mobile" path="/profesionales/dashboard" name="Mi Panel" icon={<LayoutDashboard size={18}/>} onClick={closeMobileMenu} exact={false} />
              )}

              <div className="pt-4 mt-4 border-t border-border/40 dark:border-gray-700/50 space-y-2">
                {user ? (
                  <>
                    <Button onClick={handleLogout} variant="outline" className="w-full justify-start py-3">
                        <LogOut size={18} className="mr-3" /> Cerrar Sesión
                    </Button>
                    <div className="flex justify-around pt-2">
                       <NotificationsDropdown isMobile={true} onOpenChange={closeMobileMenu} />
                       <MessagesDropdown isMobile={true} onOpenChange={closeMobileMenu} /> {/* Añadido MessagesDropdown para móvil */}
                    </div>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full justify-start py-3" onClick={closeMobileMenu}>
                        <Link to="/login"><LogIn size={18} className="mr-3" /> Iniciar Sesión</Link>
                    </Button>
                    <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground py-3" onClick={closeMobileMenu}>
                        <Link to="/registro"><UserPlus size={18} className="mr-3" /> Registrarse</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
