
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const Auth = () => {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleForgotPassword = () => {
    setMode('forgot');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'forgot' ? (
          <ForgotPasswordForm onBack={handleBackToLogin} />
        ) : (
          <AuthForm
            mode={mode}
            onToggleMode={toggleMode}
            onForgotPassword={handleForgotPassword}
          />
        )}
        
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground">
            <h2 className="font-semibold text-foreground mb-2">CRM Dashboard</h2>
            <p>Sistema de gestión de relaciones con clientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
