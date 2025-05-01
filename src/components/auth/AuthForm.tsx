
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Inicio de sesión exitoso');
      navigate('/admin');
    } catch (error: any) {
      toast.error('Error al iniciar sesión', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast.success('Registro exitoso', {
        description: 'Por favor, verifica tu correo electrónico para confirmar tu cuenta.'
      });
    } catch (error: any) {
      toast.error('Error al registrarse', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-geeky-dark border-geeky-purple/30">
      <CardHeader>
        <CardTitle className="text-geeky-cyan text-center">Acceso al Panel de Admin</CardTitle>
        <CardDescription className="text-geeky-purple/70 text-center">
          Inicia sesión o registrate para gestionar GeekyBot
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 mx-6">
          <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="signup">Registrarse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-geeky-purple">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-geeky-dark/50 border-geeky-purple/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-geeky-purple">
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-geeky-dark/50 border-geeky-purple/50"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit"
                className="w-full bg-geeky-purple hover:bg-geeky-purple/80"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-geeky-purple">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-geeky-dark/50 border-geeky-purple/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-geeky-purple">
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-geeky-dark/50 border-geeky-purple/50"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit"
                className="w-full bg-geeky-purple hover:bg-geeky-purple/80"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
