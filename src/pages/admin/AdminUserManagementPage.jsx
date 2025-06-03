import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search, Edit2, Trash2, UserPlus, UserX, UserCheck, ShieldCheck, ShieldOff, MoreVertical,
  Users as UsersIcon, Briefcase, Award, Activity, Clock, AlertTriangle, CheckCircle2, XCircle, Eye
} from 'lucide-react';
import { Label } from '@/components/ui/label';

// TODO: API Call - Replace with actual data fetching.
const initialUsers = [
  // Dates are in YYYY-MM-DD format as per previous setup.
  // avatarUrl placeholders point to non-existent files for now.
  { id: 'usr_001', name: 'Ana Pérez', email: 'ana.perez@example.com', avatarUrl: '/avatars/avatar-female-1.png', type: 'patient', plan: null, status: 'Active', registrationDate: '2023-01-15', validated: false },
  { id: 'usr_002', name: 'Dr. Carlos Soler', email: 'c.soler@clinic.com', avatarUrl: '/avatars/avatar-male-1.png', type: 'professional', plan: 'Premium', status: 'Active', registrationDate: '2023-02-20', validated: true },
  { id: 'usr_003', name: 'Laura Vidal', email: 'laura.v@example.com', avatarUrl: '/avatars/avatar-female-2.png', type: 'patient', plan: null, status: 'Inactive', registrationDate: '2023-03-01', validated: false },
  { id: 'usr_004', name: 'Dra. Elena Marco', email: 'elena.marco@mail.net', avatarUrl: '/avatars/avatar-female-3.png', type: 'professional', plan: 'Básico', status: 'Pending Validation', registrationDate: '2023-04-10', validated: false },
  { id: 'usr_005', name: 'Pedro Gómez', email: 'pedro.gomez@work.com', avatarUrl: '/avatars/avatar-male-2.png', type: 'patient', plan: null, status: 'Suspended', registrationDate: '2023-05-22', validated: false },
  { id: 'usr_006', name: 'Dr. John Doe', email: 'john.doe@example.com', avatarUrl: '/avatars/avatar-male-3.png', type: 'professional', plan: 'Enterprise', status: 'Active', registrationDate: '2023-06-01', validated: true },
  { id: 'usr_007', name: 'Lucía Fernández', email: 'lucia.fdz@example.com', avatarUrl: '/avatars/avatar-female-4.png', type: 'professional', plan: 'Básico', status: 'Active', registrationDate: '2023-07-10', validated: true },
  { id: 'usr_008', name: 'Miguel Ángel Roca', email: 'miguel.roca@example.com', avatarUrl: '/avatars/avatar-male-4.png', type: 'professional', plan: 'Premium', status: 'Suspended', registrationDate: '2023-08-15', validated: true },
];

// Simple Avatar Component
const Avatar = ({ src, name, size = "h-10 w-10" }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  return (
    <div className={`rounded-full ${size} flex items-center justify-center bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-400 overflow-hidden`}>
      {src ? (
        <img src={src} alt={name} className="object-cover w-full h-full" onError={(e) => e.target.style.display='none'} />
      ) : (
        <span className="font-medium">{initials.substring(0,2)}</span>
      )}
      {!src && <span className="font-medium text-xs">{initials.substring(0,2)}</span>}
    </div>
  );
};

const UserTypeBadge = ({ type }) => {
  if (type === 'professional') return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-700/50">Profesional</Badge>;
  return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-700/50">Paciente</Badge>;
};

const PlanBadge = ({ plan }) => {
  if (!plan) return '-';
  let className = '';
  if (plan === 'Básico') className = "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-700/50";
  else if (plan === 'Premium') className = "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300 border-purple-300 dark:border-purple-700/50";
  else if (plan === 'Enterprise') className = "bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300 border-orange-300 dark:border-orange-700/50";
  return <Badge className={className}>{plan}</Badge>;
};

const StatusBadge = ({ status }) => {
  let icon;
  let className = "font-medium ";
  if (status === 'Active') { icon = <CheckCircle2 className="mr-1 h-3 w-3"/>; className += "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-700/50"; }
  else if (status === 'Suspended') { icon = <AlertTriangle className="mr-1 h-3 w-3"/>; className += "bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300 border-orange-300 dark:border-orange-700/50"; }
  else if (status === 'Pending Validation') { icon = <Clock className="mr-1 h-3 w-3"/>; className += "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50"; }
  else if (status === 'Inactive') { icon = <XCircle className="mr-1 h-3 w-3"/>; className += "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-700/50"; }
  return <Badge className={className}>{icon}{status}</Badge>;
};


const AdminUserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', type: 'patient', plan: '' });

  const filteredUsers = useMemo(() => users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower);
    const matchesPlan = filterPlan === 'all' || (user.plan || 'none') === filterPlan || (filterPlan === 'none' && !user.plan) ;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  }), [users, searchTerm, filterPlan, filterStatus]);

  const planCounts = useMemo(() => ({
    'Básico': users.filter(u => u.plan === 'Básico').length,
    'Premium': users.filter(u => u.plan === 'Premium').length,
    'Enterprise': users.filter(u => u.plan === 'Enterprise').length,
  }), [users]);

  // Placeholder action handlers
  const handleEditUser = (userId) => {
    // TODO: Implement API call for fetching user data and pre-filling edit form.
    // For now, it might open a modal with existing data if available or just log.
    console.warn("API Call Placeholder: Edit user - ", userId);
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      // Logic to open modal with userToEdit data would go here.
      alert(`Placeholder: Edit user ${userToEdit.name}. Check console.`);
    }
  };
  const handleSuspendToggle = (userId, currentStatus) => {
    // TODO: Implement API call to PATCH user status.
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    console.warn("API Call Placeholder: Toggle suspend user - ", userId, "to", newStatus);
  };
  const handleDeleteUser = (userId) => {
    // TODO: Implement API call to DELETE user.
    // Actual deletion would involve a confirmation dialog, which is already implemented with AlertDialog.
    setUsers(users.filter(u => u.id !== userId));
    console.warn("API Call Placeholder: Delete user - ", userId);
  };
  const handleValidateUser = (userId) => {
    // TODO: Implement API call to PATCH user validation status.
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'Active', validated: true } : u));
    console.warn("API Call Placeholder: Validate user - ", userId);
  };

  const handleOpenAddUserModal = () => {
    setNewUserData({ name: '', email: '', type: 'patient', plan: '', status: 'Active', registrationDate: new Date().toISOString().split('T')[0], validated: false, avatarUrl: '' });
    setIsAddUserModalOpen(true);
  };

  const handleSaveNewUser = () => {
    // TODO: Implement API call to POST new user data.
    // Basic validation
    if (!newUserData.name || !newUserData.email) {
      alert("Nombre y Email son requeridos."); // Simple alert, consider a toast for better UX.
      return;
    }
    const newUser = {
      id: `usr_${String(Date.now()).slice(-3)}${String(Math.floor(Math.random()*100)).padStart(2,'0')}`, // Client-generated ID, API should generate its own.
      ...newUserData,
      avatarUrl: newUserData.avatarUrl || `/avatars/avatar-placeholder.png`,
      validated: newUserData.type === 'patient' ? false : (newUserData.validated || false),
      status: newUserData.type === 'professional' && !newUserData.validated ? 'Pending Validation' : (newUserData.status || 'Active'),
      plan: newUserData.type === 'patient' ? null : (newUserData.plan || 'Básico'),
    };
    setUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    console.warn("API Call Placeholder: Add new user - ", newUser);
  };

  const indicatorCards = [
    { title: "Total de Usuarios", value: users.length, icon: UsersIcon, color: "text-blue-500" },
    { title: "Plan Básico", value: planCounts['Básico'], icon: Award, color: "text-green-500" },
    { title: "Plan Premium", value: planCounts['Premium'], icon: Briefcase, color: "text-purple-500" },
    { title: "Plan Enterprise", value: planCounts['Enterprise'], icon: Activity, color: "text-orange-500" },
  ];

  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-muted-foreground dark:text-gray-400">Administra todos los usuarios de la plataforma.</p>
        </header>

        {/* Indicators Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {indicatorCards.map(card => (
            <div key={card.title} className="bg-card dark:bg-gray-800/70 p-4 rounded-lg border border-border dark:border-gray-700/50 shadow-sm flex items-center space-x-3">
              <div className={`p-2 rounded-full ${card.color.replace('text-', 'bg-')}/10`}><card.icon size={20} className={card.color} /></div>
              <div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">{card.title}</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Controls: Search, Filters, Add User Button */}
        <div className="mb-6 p-4 bg-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-border dark:border-gray-700/50 shadow-md">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background dark:bg-gray-900/70 border-border dark:border-gray-700 focus:ring-primary dark:focus:ring-blue-500"
              />
            </div>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-[180px] bg-background dark:bg-gray-900/70 border-border dark:border-gray-700">
                <SelectValue placeholder="Filtrar por Plan" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                <SelectItem value="all">Todos los Planes</SelectItem>
                <SelectItem value="none">Sin Plan (Pacientes)</SelectItem>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px] bg-background dark:bg-gray-900/70 border-border dark:border-gray-700">
                <SelectValue placeholder="Filtrar por Estado" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending Validation">Pending Validation</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleOpenAddUserModal} className="w-full md:w-auto bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Añadir Usuario
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-border dark:border-gray-700/50 shadow-lg overflow-x-auto">
          <Table>
            <TableCaption className="dark:text-gray-400">Total de usuarios mostrados: {filteredUsers.length}</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-muted/30 dark:hover:bg-gray-700/30 border-b dark:border-gray-700/50">
                <TableHead className="text-gray-700 dark:text-gray-300">Usuario</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Tipo</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Plan</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Fecha de Registro</TableHead>
                <TableHead className="text-right text-gray-700 dark:text-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700/50 last:border-b-0">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar src={user.avatarUrl} name={user.name} />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><UserTypeBadge type={user.type} /></TableCell>
                  <TableCell><PlanBadge plan={user.plan} /></TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell className="text-muted-foreground dark:text-gray-400">{user.registrationDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)} className="hover:!bg-muted/50 dark:hover:!bg-gray-700/50">
                          <Edit2 className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        {user.type === 'professional' && user.status === 'Pending Validation' && (
                          <DropdownMenuItem onClick={() => handleValidateUser(user.id)} className="hover:!bg-muted/50 dark:hover:!bg-gray-700/50 text-green-600 dark:text-green-400 hover:!text-green-700 dark:hover:!text-green-500">
                            <ShieldCheck className="mr-2 h-4 w-4" /> Validar Profesional
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleSuspendToggle(user.id, user.status)} className="hover:!bg-muted/50 dark:hover:!bg-gray-700/50">
                          {user.status === 'Active' ? <UserX className="mr-2 h-4 w-4 text-orange-500 dark:text-orange-400" /> : <UserCheck className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />}
                          {user.status === 'Active' ? 'Suspender' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border dark:bg-gray-700" />
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 dark:text-red-400 hover:!text-red-700 dark:hover:!text-red-500 hover:!bg-red-500/10 dark:hover:!bg-red-500/20">
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredUsers.length === 0 && (
            <p className="text-center py-10 text-muted-foreground dark:text-gray-400">No se encontraron usuarios con los criterios seleccionados.</p>
        )}

        {/* Add User Modal */}
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-800 dark:text-white">Añadir Nuevo Usuario</DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-gray-400">
                Complete los detalles para crear un nuevo usuario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right col-span-1 dark:text-gray-300">Nombre</Label>
                <Input id="name" value={newUserData.name} onChange={(e) => setNewUserData({...newUserData, name: e.target.value})} className="col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right col-span-1 dark:text-gray-300">Email</Label>
                <Input id="email" type="email" value={newUserData.email} onChange={(e) => setNewUserData({...newUserData, email: e.target.value})} className="col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right col-span-1 dark:text-gray-300">Tipo</Label>
                <Select value={newUserData.type} onValueChange={(value) => setNewUserData({...newUserData, type: value, plan: value === 'patient' ? '' : (newUserData.plan || 'Básico')})}>
                  <SelectTrigger className="col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                    <SelectItem value="patient">Paciente</SelectItem>
                    <SelectItem value="professional">Profesional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUserData.type === 'professional' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right col-span-1 dark:text-gray-300">Plan</Label>
                   <Select value={newUserData.plan || 'Básico'} onValueChange={(value) => setNewUserData({...newUserData, plan: value})}>
                    <SelectTrigger className="col-span-3 bg-input dark:bg-gray-900/70 border-border dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)} className="dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-700">Cancelar</Button>
              <Button onClick={handleSaveNewUser} className="bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">Guardar Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default AdminUserManagementPage;
