
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone, Mail, Users, MessageSquare, Star, CheckCircle, DollarSign, ShieldCheck, Award, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const sampleProfessionalsData = [
  { 
    id: 1, 
    name: 'Dr. Alejandro Pérez', 
    specialty: 'Cardiología', 
    city: 'Madrid', 
    rating: 4.8, 
    reviews: 132, 
    availability: 'Mañana', 
    imageAlt: "Dr. Alejandro Pérez", 
    imageDesc: "Cardiólogo sonriente", 
    priceRange: [80, 120], 
    online: true, 
    presencial: true, 
    lat: 40.416775, 
    lng: -3.703790, 
    services: ['ECG', 'Ecocardiograma', 'Prueba de esfuerzo'], 
    biography: 'Amplia experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares. Miembro de la Sociedad Española de Cardiología. Comprometido con el cuidado integral del paciente y la aplicación de las últimas tecnologías y tratamientos basados en evidencia científica.', 
    consultationTypes: ['Consulta presencial', 'Videoconsulta'], 
    contact: {phone: '912345678', email: 'alejandro.perez@example.com'}, 
    officeHours: 'Lunes a Viernes: 9:00 - 14:00 y 16:00 - 20:00', 
    education: ['Licenciado en Medicina, Universidad Complutense de Madrid', 'Especialista en Cardiología, Hospital Gregorio Marañón'], 
    experience: ['Cardiólogo adjunto, Hospital La Paz (5 años)', 'Cardiólogo, Clínica Privada SaludCor (3 años)'], 
    languages: ['Español', 'Inglés'], 
    opinions: [{user: 'Laura M.', rating: 5, comment: 'Excelente profesional, muy atento y claro en sus explicaciones.'}, {user: 'Carlos G.', rating: 4, comment: 'Buen trato, aunque la espera fue un poco larga.'}] 
  },
  { 
    id: 2, 
    name: 'Dra. Laura Gómez', 
    specialty: 'Dermatología', 
    city: 'Barcelona', 
    rating: 4.9, 
    reviews: 98, 
    availability: 'Próxima semana', 
    imageAlt: "Dra. Laura Gómez", 
    imageDesc: "Dermatóloga profesional", 
    priceRange: [70, 100], 
    online: true, 
    presencial: false, 
    lat: 41.385063, 
    lng: 2.173404, 
    services: ['Dermatoscopia', 'Tratamiento acné', 'Peeling químico', 'Revisión de lunares'], 
    biography: 'Especialista en dermatología clínica y estética. Miembro de la Academia Española de Dermatología y Venereología. Enfoque personalizado para cada paciente, buscando siempre los mejores resultados con tratamientos innovadores y seguros.', 
    consultationTypes: ['Videoconsulta'], 
    contact: {phone: '934567890', email: 'laura.gomez@example.com'}, 
    officeHours: 'Martes a Jueves: 10:00 - 18:00', 
    education: ['Licenciada en Medicina, Universidad de Barcelona', 'Especialista en Dermatología, Hospital Clínic'], 
    experience: ['Dermatóloga, Centro Médico Teknon (4 años)'], 
    languages: ['Español', 'Catalán', 'Inglés'], 
    opinions: [{user: 'Ana P.', rating: 5, comment: 'Muy profesional y amable. Me solucionó el problema rápidamente.'}] 
  },
];


const ProfessionalProfilePage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [professional, setProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  useEffect(() => {
    const storedProfessionals = localStorage.getItem('professionals');
    let professionalsList = sampleProfessionalsData; 
    if (storedProfessionals) {
        try {
            const parsedProfessionals = JSON.parse(storedProfessionals);
            if(Array.isArray(parsedProfessionals) && parsedProfessionals.length > 0) {
                professionalsList = parsedProfessionals;
            } else {
                localStorage.setItem('professionals', JSON.stringify(sampleProfessionalsData));
            }
        } catch (error) {
            console.error("Error parsing professionals from localStorage:", error);
            localStorage.setItem('professionals', JSON.stringify(sampleProfessionalsData));
        }
    } else {
        localStorage.setItem('professionals', JSON.stringify(sampleProfessionalsData));
    }
    
    const foundProfessional = professionalsList.find(p => p.id.toString() === id);
    setProfessional(foundProfessional);

  }, [id]);

  const handleBooking = () => {
    if (!selectedTime) {
      toast({ title: "Error", description: "Por favor, selecciona una hora para la cita.", variant: "destructive" });
      return;
    }
    setShowBookingConfirmation(true);
    toast({ title: "Cita Solicitada", description: `Tu cita con ${professional.name} el ${selectedDate.toLocaleDateString()} a las ${selectedTime} ha sido solicitada. Recibirás una confirmación pronto.` });
  };

  if (!professional) {
    return <div className="container mx-auto px-4 py-10 text-center text-foreground">Cargando perfil del profesional... Si el problema persiste, intente refrescar la página o asegúrese de que los datos de ejemplo estén cargados.</div>;
  }

  const availableTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];

  return (
    <div className="bg-background dark:bg-slate-900 text-foreground dark:text-white min-h-screen">
      <section className="py-12 md:py-16 bg-card dark:bg-gray-800/50 border-b border-border dark:border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-full md:w-1/4 flex justify-center">
              <img   
                alt={`Foto de ${professional.name}`} 
                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary dark:border-blue-500 shadow-lg" src="https://pixel-p2.s3.eu-central-1.amazonaws.com/doctor/avatar/83ae545f/83ae545f-48cd-4463-b7f1-770eecc60cd5_large.jpg" />
            </div>
            <div className="w-full md:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{professional.name}</h1>
              <p className="text-xl text-primary dark:text-blue-400 font-semibold mb-2">{professional.specialty}</p>
              <div className="flex items-center text-yellow-500 dark:text-yellow-400 mb-1">
                <Star size={20} className="mr-1 fill-current" /> {professional.rating.toFixed(1)}
                <span className="text-muted-foreground dark:text-gray-400 ml-2">({professional.reviews} opiniones)</span>
              </div>
              <div className="flex items-center text-muted-foreground dark:text-gray-400 mb-3 text-sm">
                <MapPin size={16} className="mr-1.5" /> {professional.city}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {professional.online && <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full">Online</span>}
                {professional.presencial && <span className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">Presencial</span>}
              </div>
               <p className="text-muted-foreground dark:text-gray-300 text-sm mb-4 max-w-2xl">{professional.biography ? professional.biography.substring(0,150) : ''}...</p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="#calendario">Reservar Cita</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-muted dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview" className="py-2.5 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Información</TabsTrigger>
            <TabsTrigger value="services" className="py-2.5 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Servicios</TabsTrigger>
            <TabsTrigger value="calendar" id="calendario" className="py-2.5 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Calendario</TabsTrigger>
            <TabsTrigger value="opinions" className="py-2.5 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Opiniones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="bg-card dark:bg-gray-800/30 p-6 rounded-lg border border-border dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-border dark:border-gray-700">Acerca de {professional.name}</h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2 text-primary dark:text-blue-400">Biografía Completa</h3>
                    <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">{professional.biography}</p>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-3 text-primary dark:text-blue-400">Detalles</h3>
                    <ul className="space-y-2.5 text-sm">
                        <li className="flex items-center"><Briefcase size={16} className="mr-2 text-muted-foreground dark:text-gray-400"/> <span className="font-medium mr-1">Especialidad:</span> {professional.specialty}</li>
                        <li className="flex items-center"><MapPin size={16} className="mr-2 text-muted-foreground dark:text-gray-400"/> <span className="font-medium mr-1">Ubicación:</span> {professional.city}</li>
                        <li className="flex items-center"><DollarSign size={16} className="mr-2 text-muted-foreground dark:text-gray-400"/> <span className="font-medium mr-1">Precio:</span> {professional.priceRange[0]}€ - {professional.priceRange[1]}€</li>
                        <li className="flex items-center"><Clock size={16} className="mr-2 text-muted-foreground dark:text-gray-400"/> <span className="font-medium mr-1">Horario:</span> {professional.officeHours}</li>
                        <li className="flex items-center"><Users size={16} className="mr-2 text-muted-foreground dark:text-gray-400"/> <span className="font-medium mr-1">Idiomas:</span> {professional.languages?.join(', ')}</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-medium mb-3 text-primary dark:text-blue-400">Formación</h3>
                    <ul className="space-y-1.5 text-sm list-disc list-inside text-muted-foreground dark:text-gray-300">
                        {professional.education?.map((edu, i) => <li key={i}>{edu}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-medium mb-3 text-primary dark:text-blue-400">Experiencia</h3>
                    <ul className="space-y-1.5 text-sm list-disc list-inside text-muted-foreground dark:text-gray-300">
                         {professional.experience?.map((exp, i) => <li key={i}>{exp}</li>)}
                    </ul>
                </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="bg-card dark:bg-gray-800/30 p-6 rounded-lg border border-border dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-border dark:border-gray-700">Servicios Ofrecidos</h2>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {professional.services.map((service, index) => (
                <li key={index} className="flex items-center bg-muted/50 dark:bg-gray-700/40 p-3 rounded-md">
                  <CheckCircle size={18} className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">{service}</span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mt-8 mb-4">Tipos de Consulta</h3>
            <div className="flex flex-wrap gap-3">
                {professional.consultationTypes.map((type, index) => (
                    <span key={index} className="text-sm bg-primary/10 dark:bg-blue-500/20 text-primary dark:text-blue-300 px-3 py-1.5 rounded-full">
                        {type}
                    </span>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="bg-card dark:bg-gray-800/30 p-6 rounded-lg border border-border dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-border dark:border-gray-700">Reservar Cita</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="date-picker" className="block text-sm font-medium mb-1">Selecciona Fecha</Label>
                <Input 
                    type="date" 
                    id="date-picker"
                    value={selectedDate.toISOString().split('T')[0]} 
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full bg-input dark:bg-gray-900/70 border-border dark:border-gray-700"
                />
                <p className="mt-4 text-sm text-muted-foreground dark:text-gray-300">Horas disponibles para el {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {availableTimes.map(time => (
                    <Button 
                      key={time} 
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={`w-full text-xs ${selectedTime === time ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Resumen de tu cita</h3>
                {selectedTime ? (
                  <>
                    <p className="text-sm"><span className="font-medium">Profesional:</span> {professional.name}</p>
                    <p className="text-sm"><span className="font-medium">Fecha:</span> {selectedDate.toLocaleDateString()}</p>
                    <p className="text-sm"><span className="font-medium">Hora:</span> {selectedTime}</p>
                    <p className="text-sm mt-2"><span className="font-medium">Precio estimado:</span> {professional.priceRange[0]}€ - {professional.priceRange[1]}€</p>
                    <Button onClick={handleBooking} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white">Confirmar Solicitud</Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Selecciona una fecha y hora para ver el resumen.</p>
                )}
              </div>
            </div>
            {showBookingConfirmation && (
                <div className="mt-6 p-4 bg-green-500/10 text-green-700 dark:text-green-300 rounded-md text-sm">
                    ¡Solicitud de cita enviada! Recibirás un email de confirmación en breve.
                </div>
            )}
          </TabsContent>

          <TabsContent value="opinions" className="bg-card dark:bg-gray-800/30 p-6 rounded-lg border border-border dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-border dark:border-gray-700">Opiniones de Pacientes ({professional.opinions?.length || 0})</h2>
            {professional.opinions && professional.opinions.length > 0 ? (
                <div className="space-y-6">
                    {professional.opinions.map((opinion, index) => (
                        <div key={index} className="p-4 bg-muted/50 dark:bg-gray-700/40 rounded-lg border border-border dark:border-gray-600/50">
                            <div className="flex items-center mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`mr-0.5 ${i < opinion.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} />
                                ))}
                                <p className="ml-2 text-sm font-semibold">{opinion.user}</p>
                            </div>
                            <p className="text-sm text-muted-foreground dark:text-gray-300">{opinion.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground dark:text-gray-400">Este profesional aún no tiene opiniones.</p>
            )}
             <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Deja tu valoración</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-3">
                    Debes haber completado al menos 2 consultas con este profesional para poder valorarlo.
                </p>
                <Button disabled>Escribir una opinión (Próximamente)</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;
