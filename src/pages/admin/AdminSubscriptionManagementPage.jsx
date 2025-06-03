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
} from "@/components/ui/dialog"; // For "Ver Detalle" modal
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, Download, MoreVertical, Eye, RefreshCw, Ban,
  CheckCircle2, Clock, XCircle
} from 'lucide-react';

// TODO: API Call - Replace with actual data fetching.
const initialTransactions = [
  // Dates are in YYYY-MM-DD HH:MM:SS format. nextBillingDate is YYYY-MM-DD.
  { id: 'txn_001', userId: 'usr_002', userName: 'Dr. Carlos Soler', userEmail: 'c.soler@clinic.com', plan: 'Premium', amount: 39.95, currency: 'EUR', status: 'Completado', paymentMethod: 'Tarjeta', date: '2023-10-28 10:30:00', nextBillingDate: '2023-11-28' },
  { id: 'txn_002', userId: 'usr_004', userName: 'Dra. Elena Marco', userEmail: 'elena.marco@mail.net', plan: 'Básico', amount: 24.95, currency: 'EUR', status: 'Completado', paymentMethod: 'PayPal', date: '2023-10-25 14:15:00', nextBillingDate: '2023-11-25' },
  { id: 'txn_003', userId: 'usr_001', userName: 'Ana Pérez', userEmail: 'ana.perez@example.com', plan: 'N/A', amount: 15.00, currency: 'EUR', status: 'Fallido', paymentMethod: 'Tarjeta', date: '2023-10-22 09:00:00', nextBillingDate: null },
  { id: 'txn_004', userId: 'usr_005', userName: 'Pedro Gómez', userEmail: 'pedro.gomez@work.com', plan: 'Enterprise', amount: 79.90, currency: 'EUR', status: 'Pendiente', paymentMethod: 'Transferencia', date: '2023-10-20 12:00:00', nextBillingDate: null },
  { id: 'txn_005', userId: 'usr_006', userName: 'Dr. John Doe', userEmail: 'john.doe@example.com', plan: 'Premium', amount: 39.95, currency: 'EUR', status: 'Completado', paymentMethod: 'Tarjeta', date: '2023-09-28 10:30:00', nextBillingDate: '2023-10-28' },
  { id: 'txn_006', userId: 'usr_007', userName: 'Lucía Fernández', userEmail: 'lucia.fdz@example.com', plan: 'Básico', amount: 24.95, currency: 'EUR', status: 'Fallido', paymentMethod: 'PayPal', date: '2023-09-15 11:00:00', nextBillingDate: null },
];

// TODO: Refactor PlanBadge and TransactionStatusBadge into shared components (e.g., in @/components/ui/custom-badges.jsx)
// For now, definitions are kept local but consistent with AdminUserManagementPage and AdminDashboardPage.

const PlanBadge = ({ plan }) => { // Consistent with AdminUserManagementPage's PlanBadge
  if (!plan || plan === 'N/A') return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border border-gray-300 dark:border-gray-700/50">N/A</Badge>;
  let className = 'border '; // Added base border class
  if (plan === 'Básico') className += "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-700/50";
  else if (plan === 'Premium') className += "bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300 border-purple-300 dark:border-purple-700/50";
  else if (plan === 'Enterprise') className += "bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300 border-orange-300 dark:border-orange-700/50";
  return <Badge className={className}>{plan}</Badge>;
};

const TransactionStatusBadge = ({ status }) => { // Consistent with AdminDashboardPage's StatusBadge
  let icon;
  let className = "font-medium border "; // Added base border class
  if (status === 'Completado') { icon = <CheckCircle2 className="mr-1 h-3 w-3"/>; className += "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-700/50"; }
  else if (status === 'Pendiente') { icon = <Clock className="mr-1 h-3 w-3"/>; className += "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50 text-black dark:text-yellow-300"; } // Added text-black for light Pendiente
  else if (status === 'Fallido') { icon = <XCircle className="mr-1 h-3 w-3"/>; className += "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-700/50"; }
  else { return <Badge variant="outline" className="border-gray-300 dark:border-gray-600">{status}</Badge>;} // Default outline badge
  return <Badge className={className}>{icon}{status}</Badge>;
};

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => transactions.filter(txn => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = txn.id.toLowerCase().includes(searchLower) ||
                          txn.userName.toLowerCase().includes(searchLower) ||
                          txn.userEmail.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || txn.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  }), [transactions, searchTerm, filterStatus, filterPlan]);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: currency }).format(amount);
  };

  // Placeholder action handlers
  const handleViewDetails = (transaction) => {
    // This function is correctly opening the modal with selected transaction.
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };
  const handleRetryPayment = (transactionId) => {
    // TODO: Implement API call to retry payment.
    console.warn("API Call Placeholder: Retry payment for - ", transactionId);
    alert(`Placeholder: Reintentar cobro para ${transactionId}. Ver consola.`);
  };
  const handleCancelTransaction = (transactionId) => {
    // TODO: Implement API call to cancel/void transaction.
    console.warn("API Call Placeholder: Cancel transaction - ", transactionId);
    alert(`Placeholder: Anular transacción ${transactionId}. Ver consola.`);
    // Optionally, update local state if API call is successful e.g. setTransactions(prev => prev.map(t => t.id === transactionId ? {...t, status: 'Anulada'} : t))
  };
  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality.
    console.warn("API Call Placeholder: Exporting transactions to CSV...");
    alert("Placeholder: Exportar a CSV. Ver consola.");
  };


  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Transacciones</h1>
          <p className="text-muted-foreground dark:text-gray-400">Visualiza y administra todas las transacciones de la plataforma.</p>
        </header>

        {/* Controls: Search, Filters, Export Button */}
        <div className="mb-6 p-4 bg-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-border dark:border-gray-700/50 shadow-md">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar ID, usuario, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background dark:bg-gray-900/70 border-border dark:border-gray-700 focus:ring-primary dark:focus:ring-blue-500"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px] bg-background dark:bg-gray-900/70 border-border dark:border-gray-700">
                <SelectValue placeholder="Filtrar por Estado" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Fallido">Fallido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-[180px] bg-background dark:bg-gray-900/70 border-border dark:border-gray-700">
                <SelectValue placeholder="Filtrar por Plan" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                <SelectItem value="all">Todos los Planes</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportCSV} variant="outline" className="w-full md:w-auto dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-700">
              <Download className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-border dark:border-gray-700/50 shadow-lg overflow-x-auto">
          <Table>
            <TableCaption className="dark:text-gray-400">Total de transacciones mostradas: {filteredTransactions.length}</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-muted/30 dark:hover:bg-gray-700/30 border-b dark:border-gray-700/50">
                <TableHead className="text-gray-700 dark:text-gray-300">ID Transacción</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Usuario</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Plan</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Monto</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Método Pago</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Fecha</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Próx. Cobro</TableHead>
                <TableHead className="text-right text-gray-700 dark:text-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700/50 last:border-b-0">
                  <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400">{transaction.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{transaction.userName}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{transaction.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell><PlanBadge plan={transaction.plan} /></TableCell>
                  <TableCell className="font-medium text-gray-800 dark:text-white">{formatCurrency(transaction.amount, transaction.currency)}</TableCell>
                  <TableCell><TransactionStatusBadge status={transaction.status} /></TableCell>
                  <TableCell className="text-muted-foreground dark:text-gray-400">{transaction.paymentMethod}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-gray-400 text-sm">{transaction.date}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-gray-400 text-sm">{transaction.nextBillingDate || '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(transaction)} className="hover:!bg-muted/50 dark:hover:!bg-gray-700/50">
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                        </DropdownMenuItem>
                        {transaction.status === 'Fallido' && (
                          <DropdownMenuItem onClick={() => handleRetryPayment(transaction.id)} className="hover:!bg-muted/50 dark:hover:!bg-gray-700/50">
                            <RefreshCw className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" /> Reintentar Cobro
                          </DropdownMenuItem>
                        )}
                        {(transaction.status === 'Pendiente' || transaction.status === 'Completado') && (
                          <DropdownMenuItem onClick={() => handleCancelTransaction(transaction.id)} className="text-red-600 dark:text-red-400 hover:!text-red-700 dark:hover:!text-red-500 hover:!bg-red-500/10 dark:hover:!bg-red-500/20">
                            <Ban className="mr-2 h-4 w-4" /> Anular Transacción
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredTransactions.length === 0 && !transactions.length === 0 && ( // Show only if filters result in empty
            <p className="text-center py-10 text-muted-foreground dark:text-gray-400">No se encontraron transacciones con los criterios seleccionados.</p>
        )}
        {transactions.length === 0 && ( // Show if there's no data at all
            <p className="text-center py-10 text-muted-foreground dark:text-gray-400">No hay transacciones registradas.</p>
        )}

        {/* View Transaction Detail Modal */}
        {selectedTransaction && ( // Ensure modal only renders if a transaction is selected
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-800 dark:text-white">Detalle de Transacción: {selectedTransaction.id}</DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-gray-400">
                  {/* TODO: Add more details or actions if needed in future */}
                  Información completa de la transacción.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2"> {/* Added gap-3, max-h, overflow, pr */}
                <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Usuario:</span>
                  <span className="col-span-2 dark:text-gray-100 truncate">{selectedTransaction.userName} ({selectedTransaction.userEmail})</span>
                </div>
                 <div className="grid grid-cols-3 gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Plan:</span>
                  <span className="col-span-2"><PlanBadge plan={selectedTransaction.plan} /></span>
                </div>
                <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Monto:</span>
                  <span className="col-span-2 dark:text-gray-100">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Estado:</span>
                  <span className="col-span-2"><TransactionStatusBadge status={selectedTransaction.status} /></span>
                </div>
                 <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Método de Pago:</span>
                  <span className="col-span-2 dark:text-gray-100">{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Fecha Transacción:</span>
                  <span className="col-span-2 dark:text-gray-100">{selectedTransaction.date}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">Próximo Cobro:</span>
                  <span className="col-span-2 dark:text-gray-100">{selectedTransaction.nextBillingDate || 'N/A'}</span>
                </div>
                 <div className="grid grid-cols-3 items-center gap-x-2">
                  <span className="font-semibold dark:text-gray-300 col-span-1">ID Usuario:</span>
                  <span className="col-span-2 font-mono text-xs dark:text-gray-400 truncate">{selectedTransaction.userId}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-700">Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
