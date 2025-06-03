
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Search, UserCircle, MessageSquare, Archive, Filter, Maximize } from 'lucide-react';

const sampleConversations = [
  { id: 'conv1', name: 'Ana Pérez', lastMessage: 'Perfecto, muchas gracias doctor.', time: '10:35', unread: 2, avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop&q=80' },
  { id: 'conv2', name: 'Carlos López', lastMessage: 'Quería preguntarle sobre los resultados...', time: 'Ayer', unread: 0, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&q=80' },
  { id: 'conv3', name: 'Sofía Martín', lastMessage: 'Entendido, nos vemos el martes.', time: 'Hace 3 días', unread: 0, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80' },
  { id: 'conv4', name: 'Luis Fernández (Archivado)', lastMessage: 'Gracias por su tiempo.', time: 'Semana pasada', unread: 0, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80', archived: true },
];

const sampleMessages = {
  conv1: [
    { id: 'm1', sender: 'Ana Pérez', text: 'Buenos días doctor, ¿está disponible para una consulta rápida?', time: '09:15', type: 'received' },
    { id: 'm2', sender: 'Tú', text: 'Buenos días Ana, sí. ¿Qué necesita?', time: '09:16', type: 'sent' },
    { id: 'm3', sender: 'Ana Pérez', text: 'Tengo una duda sobre la medicación. ¿Puedo tomar ibuprofeno si estoy con el tratamiento X?', time: '09:18', type: 'received' },
    { id: 'm4', sender: 'Tú', text: 'En principio no hay contraindicación, pero cuénteme más sobre sus síntomas.', time: '09:20', type: 'sent' },
    { id: 'm5', sender: 'Ana Pérez', text: 'Perfecto, muchas gracias doctor.', time: '10:35', type: 'received' },
  ],
  conv2: [
    { id: 'm6', sender: 'Carlos López', text: 'Quería preguntarle sobre los resultados de la analítica.', time: 'Ayer 15:30', type: 'received' },
  ],
  conv3: [
     { id: 'm7', sender: 'Sofía Martín', text: 'Entendido, nos vemos el martes.', time: 'Hace 3 días 11:00', type: 'received' },
  ],
   conv4: [
     { id: 'm8', sender: 'Luis Fernández', text: 'Gracias por su tiempo.', time: 'Semana pasada 18:00', type: 'received' },
  ]
};

const ProfessionalMessagesPage = () => {
  const [conversations, setConversations] = useState(sampleConversations.filter(c => !c.archived));
  const [archivedConversations, setArchivedConversations] = useState(sampleConversations.filter(c => c.archived));
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0]?.id);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const currentMessages = selectedConversationId ? sampleMessages[selectedConversationId] || [] : [];
  const selectedConversation = [...conversations, ...archivedConversations].find(c => c.id === selectedConversationId);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;
    const newMessage = { id: `m${Date.now()}`, sender: 'Tú', text: messageInput, time: 'Ahora', type: 'sent' };
    sampleMessages[selectedConversationId] = [...(sampleMessages[selectedConversationId] || []), newMessage];
    
    const updatedConversations = (showArchived ? archivedConversations : conversations).map(conv => 
      conv.id === selectedConversationId ? { ...conv, lastMessage: messageInput, time: 'Ahora' } : conv
    );

    if(showArchived){
        setArchivedConversations(updatedConversations);
    } else {
        setConversations(updatedConversations);
    }
    
    setMessageInput('');
  };

  const displayedConversations = (showArchived ? archivedConversations : conversations).filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-0 md:p-4 h-[calc(100vh-120px)] flex flex-col bg-background dark:bg-slate-900">
      <header className="mb-4 md:mb-6 px-4 pt-4 md:px-0 md:pt-0">
        <h1 className="text-3xl font-bold text-foreground dark:text-white">Mensajería Interna</h1>
        <p className="text-muted-foreground dark:text-gray-400">Comunícate de forma segura con tus pacientes.</p>
      </header>

      <div className="flex-grow flex border border-border dark:border-gray-700/50 rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800/60">
        {/* Sidebar de Conversaciones */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border dark:border-gray-700/50 flex flex-col">
          <div className="p-4 border-b border-border dark:border-gray-700/50">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                    type="text" 
                    placeholder="Buscar conversación..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-background dark:bg-slate-700 border-border dark:border-gray-600 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
            </div>
            <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" className="flex-1 dark:text-gray-300 dark:hover:bg-slate-700">
                    <Filter size={14} className="mr-1" /> Filtros
                </Button>
                <Button variant={showArchived ? "secondary" : "ghost"} size="sm" className="flex-1 dark:text-gray-300 dark:hover:bg-slate-700" onClick={() => setShowArchived(!showArchived)}>
                    <Archive size={14} className="mr-1" /> {showArchived ? "Activos" : "Archivados"}
                </Button>
            </div>
          </div>
          <ScrollArea className="flex-grow">
            {displayedConversations.length > 0 ? displayedConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`flex items-center p-3 cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-700/50 border-b border-border dark:border-gray-700/30
                            ${selectedConversationId === conv.id ? 'bg-primary/10 dark:bg-blue-500/20' : ''}`}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={conv.avatar} alt={conv.name} />
                  <AvatarFallback>{conv.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                  <h3 className={`font-semibold text-sm truncate ${selectedConversationId === conv.id ? 'text-primary dark:text-blue-300' : 'text-foreground dark:text-white'}`}>{conv.name}</h3>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs text-muted-foreground dark:text-gray-500 mb-1">{conv.time}</p>
                  {conv.unread > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">{conv.unread}</span>
                  )}
                </div>
              </div>
            )) : (
                <p className="p-4 text-center text-muted-foreground dark:text-gray-400">No hay conversaciones {showArchived ? "archivadas" : "activas"} que coincidan.</p>
            )}
          </ScrollArea>
        </div>

        {/* Área de Chat */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border dark:border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    <AvatarFallback>{selectedConversation.name.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <h2 className="font-semibold text-lg text-foreground dark:text-white">{selectedConversation.name}</h2>
                    <p className="text-xs text-green-500 dark:text-green-400">Online</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-blue-400">
                    <Maximize size={20} />
                </Button>
              </div>
              <ScrollArea className="flex-grow p-4 space-y-4 bg-background/30 dark:bg-slate-800/30">
                {currentMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-xl ${msg.type === 'sent' ? 'bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white' : 'bg-muted dark:bg-gray-700 text-foreground dark:text-gray-200'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'sent' ? 'text-blue-200 dark:text-gray-300 text-right' : 'text-gray-500 dark:text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border dark:border-gray-700/50 flex items-center gap-2 bg-card dark:bg-gray-800/60">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-blue-400">
                  <Paperclip size={20} />
                </Button>
                <Input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-grow bg-background dark:bg-slate-700 border-border dark:border-gray-600 text-foreground dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send size={20} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-background/30 dark:bg-slate-800/30">
              <MessageSquare size={64} className="text-muted-foreground/30 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground dark:text-gray-400">Selecciona una conversación</h2>
              <p className="text-muted-foreground dark:text-gray-500">Elige una conversación de la lista para ver los mensajes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMessagesPage;
