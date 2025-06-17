
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const AuthForm = ({ mode, onToggleMode, onForgotPassword }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const { error } = mode === 'login' 
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

      if (error) {
        let errorMessage = 'Ocurrió un error inesperado';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas. Por favor verifica tu email y contraseña.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
        }

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (mode === 'signup') {
        toast({
          title: 'Registro exitoso',
          description: 'Por favor revisa tu email para confirmar tu cuenta.',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {mode === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Ingresa a tu cuenta del CRM' 
            : 'Crea una nueva cuenta para acceder al CRM'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock size={16} />
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {mode === 'login' && (
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={onForgotPassword}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <Button
            type="button"
            variant="link"
            onClick={onToggleMode}
            className="text-sm"
          >
            {mode === 'login' 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
