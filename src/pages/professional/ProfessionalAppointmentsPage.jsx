
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { es } from 'date-fns/locale';
import { useTheme } from '@/components/ThemeProvider';
import { sampleAppointmentsData, formatDateForDisplay, formatDateForComparison } from '@/data/appointmentsData';
import AppointmentForm from '@/components/professional/appointments/AppointmentForm';
import AppointmentList from '@/components/professional/appointments/AppointmentList';

const ProfessionalAppointmentsPage = () => {
  const { theme } = useTheme();
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState(sampleAppointmentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  const initialFormData = {
    patientName: '', time: '', date: new Date(), type: 'Videoconsulta', status: 'Pendiente', details: '', link: '', address: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(prev => ({ ...prev, date: date }));
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate || new Date());
  };

  const filteredAppointments = appointments
    .filter(app => formatDateForComparison(app.date) === formatDateForComparison(date))
    .filter(app => app.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(app => filterStatus === 'all' || app.status === filterStatus);

  const openFormModal = (appointment = null) => {
    if (appointment) {
      setCurrentAppointment(appointment);
      setFormData({ ...appointment, date: new Date(appointment.date) });
    } else {
      setCurrentAppointment(null);
      setFormData({ ...initialFormData, date: date });
    }
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormDateChange = (newDate) => {
    setFormData(prev => ({ ...prev, date: newDate || new Date() }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentAppointment) {
      setAppointments(apps => apps.map(app => app.id === currentAppointment.id ? { ...formData, id: app.id } : app));
    } else {
      setAppointments(apps => [...apps, { ...formData, id: String(Date.now()) }]);
    }
    setIsFormOpen(false);
    setFormData(initialFormData); // Reset form
  };

  const deleteAppointment = (id) => {
    setAppointments(apps => apps.filter(app => app.id !== id));
  };
  
  const pageBackgroundColor = theme === 'dark' ? 'rgb(15 23 42 / var(--tw-bg-opacity, 1))' : 'hsl(var(--background))';

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen" style={{ backgroundColor: pageBackgroundColor }}>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Gestión de Citas</h1>
        <p className="text-muted-foreground dark:text-gray-400">Organiza y gestiona todas tus citas programadas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card dark:bg-gray-800/60 border-border dark:border-gray-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">Selecciona Fecha</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                className="rounded-md border dark:border-gray-700 bg-background dark:bg-slate-900"
                locale={es}
              />
            </CardContent>
          </Card>
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setFormData(initialFormData); }}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base" onClick={() => openFormModal()}>
                <PlusCircle size={20} className="mr-2" /> Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-card dark:bg-gray-800 border-border dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-foreground dark:text-white">{currentAppointment ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-gray-400">
                  {currentAppointment ? 'Modifica los detalles de la cita.' : 'Añade una nueva cita a tu calendario.'}
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm 
                formData={formData}
                handleFormChange={handleFormChange}
                handleFormDateChange={handleFormDateChange}
                handleFormSubmit={handleFormSubmit}
                currentAppointment={currentAppointment}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card dark:bg-gray-800/60 border-border dark:border-gray-700/50 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-foreground dark:text-white">Citas para el {formatDateForDisplay(date)}</CardTitle>
                  <CardDescription className="text-muted-foreground dark:text-gray-400">Listado de citas programadas para el día seleccionado.</CardDescription>
                </div>
                 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input 
                        type="text" 
                        placeholder="Buscar paciente..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-full sm:max-w-xs bg-background dark:bg-slate-700 border-border dark:border-gray-600 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-background dark:bg-slate-700 border-border dark:border-gray-600 text-foreground dark:text-white">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover dark:bg-slate-700 border-border dark:border-gray-600 text-popover-foreground dark:text-white">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="Confirmada">Confirmada</SelectItem>
                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                            <SelectItem value="Completada">Completada</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </div>
            </CardHeader>
            <CardContent>
              <AppointmentList 
                appointments={filteredAppointments}
                onEdit={openFormModal}
                onDelete={deleteAppointment}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAppointmentsPage;
