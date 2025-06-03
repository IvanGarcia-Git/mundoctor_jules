
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserCircle, Users, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sampleMessages = [
  { id: 1, sender: 'Ana Pérez', text: 'Hola, quería confirmar nuestra cita de mañana...', time: "Hace 10m", unread: true, avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, sender: 'Carlos López', text: 'Gracias por la consulta, todo perfecto.', time: "Hace 1h", unread: false, avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, sender: 'Equipo Soporte', text: 'Recordatorio: Actualiza tu disponibilidad semanal.', time: "Ayer", unread: true, avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, sender: 'Laura Gómez', text: '¿Podríamos reprogramar la sesión del viernes?', time: "Hace 2 días", unread: false, avatar: "https://i.pravatar.cc/150?img=4" },
];

const MessagesDropdown = ({ isMobile = false, onOpenChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unreadCount = sampleMessages.filter(m => m.unread).length;

  const handleViewAllMessages = () => {
    if (isMobile && onOpenChange) {
      onOpenChange(false); // Cierra el dropdown en móvil antes de navegar
    }
    if (user && user.role === 'professional') {
      navigate('/profesionales/mensajes');
    } else if (user) {
      navigate('/mensajes'); 
    } else {
      navigate('/login'); // Si no hay usuario, redirigir a login
    }
  };
  
  const TriggerButton = React.forwardRef((props, ref) => (
    <Button {...props} ref={ref} variant="ghost" size="icon" className={`relative text-muted-foreground hover:text-foreground ${isMobile ? 'w-full justify-center' : 'inline-flex'}`}>
       <MessageCircle size={isMobile ? 22 : 20} />
       {unreadCount > 0 && (
         <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-min p-0.5 text-xs flex items-center justify-center">
           {unreadCount}
         </Badge>
       )}
       <span className="sr-only">Mensajes</span>
     </Button>
 ));
 TriggerButton.displayName = 'TriggerButton';

  return (
    <DropdownMenu onOpenChange={isMobile ? onOpenChange : undefined}>
      <DropdownMenuTrigger asChild>
        <TriggerButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 bg-card dark:bg-gray-800 border-border dark:border-gray-700">
        <DropdownMenuLabel className="flex justify-between items-center text-foreground dark:text-white">
          <span>Mensajes Recientes</span>
          {unreadCount > 0 && <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300">{unreadCount} Nuevos</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-gray-700/50" />
        {sampleMessages.length > 0 ? (
          <ScrollArea className="h-[300px]">
            {sampleMessages.map(message => (
              <DropdownMenuItem key={message.id} asChild className={`cursor-pointer hover:!bg-muted/80 dark:hover:!bg-gray-700/50 ${message.unread ? 'bg-primary/5 dark:bg-blue-500/10' : ''}`}>
                <div onClick={handleViewAllMessages} className="flex items-start gap-3 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>{message.sender.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow overflow-hidden">
                    <p className={`text-sm font-medium truncate ${message.unread ? 'text-foreground dark:text-white font-semibold' : 'text-muted-foreground dark:text-gray-300'}`}>{message.sender}</p>
                    <p className={`text-xs truncate ${message.unread ? 'text-foreground/80 dark:text-gray-200' : 'text-muted-foreground/80 dark:text-gray-400'}`}>{message.text}</p>
                    <p className="text-xs text-muted-foreground/60 dark:text-gray-500 mt-0.5">{message.time}</p>
                  </div>
                  {message.unread && <div className="h-2 w-2 rounded-full bg-primary dark:bg-blue-500 self-center flex-shrink-0 ml-auto"></div>}
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground dark:text-gray-400">No tienes mensajes.</div>
        )}
        <DropdownMenuSeparator className="dark:bg-gray-700/50" />
        <DropdownMenuItem className="justify-center text-sm text-primary dark:text-blue-400 hover:!bg-muted/80 dark:hover:!bg-gray-700/50 cursor-pointer" onClick={handleViewAllMessages}>
            Ver todos los mensajes <ArrowRight size={14} className="ml-1.5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessagesDropdown;
