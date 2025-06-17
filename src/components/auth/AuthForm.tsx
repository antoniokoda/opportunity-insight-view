import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { handleError, ErrorCodes } from '@/utils/errorUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { Label } from '@/components/ui/label';

const authSchema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
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
        handleError(error, 'AuthForm');
      } else if (mode === 'signup') {
        toast({
          title: 'Registro exitoso',
          description: 'Por favor revisa tu email para confirmar tu cuenta.',
        });
      }
    } catch (err) {
      handleError(err, 'AuthForm');
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
                      aria-describedby="email-error"
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <FormMessage className="text-red-500" id="email-error">
                      {form.formState.errors.email.message}
                    </FormMessage>
                  )}
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
                      aria-describedby="password-error"
                    />
                  </FormControl>
                  {form.formState.errors.password && (
                    <FormMessage className="text-red-500" id="password-error">
                      {form.formState.errors.password.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'login' ? 'Iniciando sesión...' : 'Registrando...'}
                  </>
                ) : (
                  mode === 'login' ? 'Iniciar sesión' : 'Registrarse'
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                onClick={onToggleMode}
                disabled={loading}
                className="text-sm"
              >
                {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </Button>

              {mode === 'login' && (
                <Button
                  type="button"
                  variant="link"
                  onClick={onForgotPassword}
                  disabled={loading}
                  className="text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
