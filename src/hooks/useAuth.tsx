
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AUTH DEBUG: Initializing auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 AUTH DEBUG: Auth state changed', {
          event,
          session: session ? {
            user_id: session.user?.id,
            email: session.user?.email,
            expires_at: session.expires_at,
            access_token: session.access_token ? 'Present' : 'Missing'
          } : null
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Additional verification
        if (session?.user) {
          console.log('🔍 AUTH DEBUG: User authenticated successfully', {
            userId: session.user.id,
            email: session.user.email,
            role: session.user.role
          });
        } else {
          console.log('🔍 AUTH DEBUG: No authenticated user');
        }
      }
    );

    // Check for existing session
    console.log('🔍 AUTH DEBUG: Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🔍 AUTH DEBUG: Error getting session:', error);
      } else {
        console.log('🔍 AUTH DEBUG: Initial session check', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🔍 AUTH DEBUG: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 AUTH DEBUG: Auth state updated', { 
      user: !!user, 
      userId: user?.id,
      session: !!session,
      loading,
      userEmail: user?.email
    });
  }, [user, session, loading]);

  const signUp = async (email: string, password: string) => {
    console.log('🔍 AUTH DEBUG: Attempting sign up for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('🔍 AUTH DEBUG: Sign up error:', error);
    } else {
      console.log('🔍 AUTH DEBUG: Sign up successful');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔍 AUTH DEBUG: Attempting sign in for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('🔍 AUTH DEBUG: Sign in error:', error);
    } else {
      console.log('🔍 AUTH DEBUG: Sign in successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🔍 AUTH DEBUG: Signing out...');
    await supabase.auth.signOut();
    console.log('🔍 AUTH DEBUG: Sign out completed');
  };

  const resetPassword = async (email: string) => {
    console.log('🔍 AUTH DEBUG: Resetting password for:', email);
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('🔍 AUTH DEBUG: Reset password error:', error);
    } else {
      console.log('🔍 AUTH DEBUG: Reset password email sent');
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
