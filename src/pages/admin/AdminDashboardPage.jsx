import React from 'react';
import { Users, Euro, Activity, Ticket as TicketIcon, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// TODO: API Call - Replace with actual data fetching for KPIs, charts, and recent transactions.
// Placeholder Data
const kpiData = [
  { title: "Total de Usuarios", value: "1,350", change: "+5% mensual", icon: Users, iconColor: "text-blue-400", bgColor: "bg-blue-500/10" },
  { title: "Ingresos Mensuales", value: "€12,500", change: "+2.3% vs mes anterior", icon: Euro, iconColor: "text-green-400", bgColor: "bg-green-500/10" },
  { title: "Suscripciones Activas", value: "320", change: "-1.5% vs mes anterior", icon: Activity, iconColor: "text-purple-400", bgColor: "bg-purple-500/10" },
  { title: "Tickets Abiertos", value: "25", change: "+10% vs semana anterior", icon: TicketIcon, iconColor: "text-yellow-400", bgColor: "bg-yellow-500/10" },
];

const monthlyIncomeData = [
  { name: 'Jul', Ingresos: 9800 },
  { name: 'Ago', Ingresos: 11200 },
  { name: 'Sep', Ingresos: 10500 },
  { name: 'Oct', Ingresos: 13000 },
  { name: 'Nov', Ingresos: 12500 },
  { name: 'Dic', Ingresos: 14200 },
];

const userGrowthData = [
  { name: 'Pacientes', count: 1200, fill: 'rgba(54, 162, 235, 0.7)' }, // blue
  { name: 'Profesionales', count: 350, fill: 'rgba(75, 192, 192, 0.7)' }, // green
];

const recentTransactionsData = [
  { id: "txn_1", user: "usuario1@example.com", type: "Suscripción Premium", amount: "€49.99", date: "2023-12-01", status: "Completado" },
  { id: "txn_2", user: "profesional_doc@example.com", type: "Créditos Consulta", amount: "€25.00", date: "2023-12-03", status: "Pendiente" },
  { id: "txn_3", user: "paciente_nuevo@example.com", type: "Suscripción Básica", amount: "€19.99", date: "2023-12-05", status: "Fallido" },
  { id: "txn_4", user: "testuser4@example.com", type: "Suscripción Premium", amount: "€49.99", date: "2023-12-06", status: "Completado" },
  { id: "txn_5", user: "anotherpro@example.com", type: "Paquete Anual", amount: "€299.00", date: "2023-12-07", status: "Completado" },
];

const StatusBadge = ({ status }) => {
  // This component is specific to transaction statuses on the dashboard.
  // A similar component `TransactionStatusBadge` exists in AdminTransactionsPage.
  // TODO: Refactor into a shared component if further customization isn't needed.
  switch (status) {
    case 'Completado':
      return <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border border-green-300 dark:border-green-700/50"><CheckCircle2 className="mr-1 h-3 w-3" />{status}</Badge>;
    case 'Pendiente':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700/50 text-black dark:text-yellow-300"><Clock className="mr-1 h-3 w-3" />{status}</Badge>;
    case 'Fallido':
      return <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border border-red-300 dark:border-red-700/50"><XCircle className="mr-1 h-3 w-3" />{status}</Badge>;
    default:
      return <Badge variant="outline" className="border-gray-300 dark:border-gray-600">{status}</Badge>;
  }
};


const AdminDashboardPage = () => {
  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-600 dark:text-gray-400">Bienvenido al centro de control de Mundoctor.</p>
        </header>

        {/* KPIs Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiData.map(kpi => (
            <div key={kpi.title} className="bg-card dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-border dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`p-3 inline-block ${kpi.bgColor} rounded-lg mb-4`}>
                <kpi.icon size={28} className={kpi.iconColor} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{kpi.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</p>
              <p className={`text-xs mt-1 ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{kpi.change}</p>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Monthly Income Chart */}
          <div className="bg-card dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-border dark:border-gray-700/60 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Ingresos Mensuales (Últimos 6 Meses)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyIncomeData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} className="dark:stroke-gray-700" />
                <XAxis dataKey="name" tick={{ fill: 'rgb(156 163 175)' }} />
                <YAxis tickFormatter={(value) => `€${value/1000}k`} tick={{ fill: 'rgb(156 163 175)' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgb(55, 65, 81)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)'}}
                />
                <Legend wrapperStyle={{ color: 'rgb(156 163 175)' }} />
                <Line type="monotone" dataKey="Ingresos" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth Chart */}
          <div className="bg-card dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-border dark:border-gray-700/60 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Crecimiento de Usuarios</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} className="dark:stroke-gray-700" />
                <XAxis type="number" tick={{ fill: 'rgb(156 163 175)' }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'rgb(156 163 175)' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgb(55, 65, 81)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)'}}
                />
                <Legend wrapperStyle={{ color: 'rgb(156 163 175)' }} />
                <Bar dataKey="count" name="Total" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Transactions Table */}
        <section className="bg-card dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-border dark:border-gray-700/60 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Transacciones Recientes</h2>
          <Table>
            <TableCaption className="dark:text-gray-400">Una lista de las transacciones más recientes.</TableCaption>
            <TableHeader>
              <TableRow className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <TableHead className="text-gray-700 dark:text-gray-300">Usuario</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Tipo</TableHead>
                <TableHead className="text-right text-gray-700 dark:text-gray-300">Monto</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Fecha</TableHead>
                <TableHead className="text-center text-gray-700 dark:text-gray-300">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactionsData.map((transaction) => (
                <TableRow key={transaction.id} className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableCell className="font-medium text-gray-800 dark:text-gray-100">{transaction.user}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{transaction.type}</TableCell>
                  <TableCell className="text-right text-gray-600 dark:text-gray-300">{transaction.amount}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{transaction.date}</TableCell>
                  <TableCell className="text-center"><StatusBadge status={transaction.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
