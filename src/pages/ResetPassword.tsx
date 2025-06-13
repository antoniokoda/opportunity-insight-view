
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    console.log('ResetPassword: Current session:', session);
    
    // Check if we have a valid session for password reset
    if (session && session.user) {
      console.log('ResetPassword: Valid session found');
      setValidSession(true);
      setCheckingSession(false);
    } else {
      console.log('ResetPassword: No valid session');
      // Wait a bit more for the auth state to settle
      const timer = setTimeout(() => {
        if (!session) {
          console.log('ResetPassword: No session after timeout, redirecting to auth');
          toast({
            title: 'Enlace inválido',
            description: 'El enlace de recuperación es inválido o ha expirado.',
            variant: 'destructive',
          });
          navigate('/auth');
        }
        setCheckingSession(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [session, navigate, toast]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!session) {
      toast({
        title: 'Error',
        description: 'No hay una sesión válida para cambiar la contraseña.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('ResetPassword: Updating password');
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        console.error('ResetPassword: Error updating password:', error);
        toast({
          title: 'Error',
          description: 'No se pudo actualizar la contraseña. Por favor intenta de nuevo.',
          variant: 'destructive',
        });
      } else {
        console.log('ResetPassword: Password updated successfully');
        setSuccess(true);
        toast({
          title: 'Contraseña actualizada',
          description: 'Tu contraseña ha sido actualizada exitosamente.',
        });
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error('ResetPassword: Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              Verificando enlace...
            </CardTitle>
            <CardDescription>
              Por favor espera mientras verificamos tu enlace de recuperación
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show success screen
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle size={24} />
              Contraseña Actualizada
            </CardTitle>
            <CardDescription>
              Tu contraseña ha sido cambiada exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Serás redirigido al dashboard en unos segundos...
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password reset form if we have a valid session
  if (validSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock size={24} />
              Nueva Contraseña
            </CardTitle>
            <CardDescription>
              Ingresa tu nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Ingresa tu nueva contraseña"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirma tu nueva contraseña"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Actualizar Contraseña
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This should not be reached, but just in case
  return null;
};
