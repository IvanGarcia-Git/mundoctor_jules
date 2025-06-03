
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, UserPlus as UserPlusIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';


const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('patient'); 
  const [professionalLicense, setProfessionalLicense] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      toast({
        title: "Error de registro",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    if (role === 'professional' && !professionalLicense) {
      setError('El número de colegiado es obligatorio para profesionales.');
      setIsLoading(false);
      toast({
        title: "Error de registro",
        description: "El número de colegiado es obligatorio para profesionales.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      ...(role === 'professional' && { professionalLicense, subscriptionPlanId: 'free' }) // Añadir licencia y plan free por defecto
    };

    console.log('Nuevo usuario registrado (simulado):', newUser);
    
    // Simular login automático después del registro
    login(newUser, navigate); // Pasamos navigate a login
    
    toast({
      title: "Registro exitoso",
      description: `¡Bienvenido a Mundoctor, ${name}! Tu cuenta ha sido creada.`,
    });
    // La redirección se maneja dentro de la función login del AuthContext
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl bg-card/80 backdrop-blur-lg border-border/20">
          <CardHeader className="text-center">
            <Link to="/" className="inline-block mb-6">
              <Logo className="h-10 mx-auto" />
            </Link>
            <CardTitle className="text-3xl font-bold text-foreground">Crear Cuenta</CardTitle>
            <CardDescription className="text-muted-foreground">Únete a la comunidad Mundoctor.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu Nombre Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background/70 dark:bg-slate-700/50 border-border/30 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/70 dark:bg-slate-700/50 border-border/30 focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mín. 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-background/70 dark:bg-slate-700/50 border-border/30 focus:border-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-background/70 dark:bg-slate-700/50 border-border/30 focus:border-primary pr-10"
                    />
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Soy un...</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="w-full bg-background/70 dark:bg-slate-700/50 border-border/30 focus:border-primary">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover dark:bg-slate-800 border-border dark:border-slate-700">
                    <SelectItem value="patient">Paciente</SelectItem>
                    <SelectItem value="professional">Profesional Sanitario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === 'professional' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <Label htmlFor="professionalLicense">Número de Colegiado</Label>
                  <Input
                    id="professionalLicense"
                    type="text"
                    placeholder="Ej: 2828XXXXX"
                    value={professionalLicense}
                    onChange={(e) => setProfessionalLicense(e.target.value)}
                    required={role === 'professional'}
                    className="bg-background/70 dark:bg-slate-700/50 border-border/30 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">Este número será verificado.</p>
                </motion.div>
              )}

              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              
              <div className="pt-2">
                <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-background border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                     <UserPlusIcon size={20} className="mr-2" />
                  )}
                  {isLoading ? 'Creando cuenta...' : 'Registrarme'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-center block">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      <p className="mt-8 text-xs text-center text-muted-foreground/50">
        &copy; {new Date().getFullYear()} Mundoctor. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default RegisterPage;
