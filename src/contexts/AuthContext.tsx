import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AuthError, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security event logging
const logSecurityEvent = async (action: string, details?: Record<string, any>) => {
  try {
    await fetch('/functions/v1/security-audit-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
      body: JSON.stringify({
        action,
        resource_type: 'auth',
        details
      })
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Session timeout (30 minutes of inactivity)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        signOut();
        toast({
          title: "Session Expired",
          description: "Your session has expired for security reasons. Please sign in again.",
          variant: "destructive",
        });
      }, 30 * 60 * 1000); // 30 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, { passive: true });
    });

    resetTimeout(); // Start initial timeout

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [user]);

  const fetchUserRole = async (userId: string) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) return 'user';

      const response = await fetch('/functions/v1/get-user-role', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
      });

      if (!response.ok) {
        return 'user';
      }

      const data = await response.json();
      return data.role || 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  // Role check functions
  const isAdmin = () => userRole === 'admin';
  const isModerator = () => userRole === 'moderator';
  const hasRole = (role: string) => userRole === role;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            user_metadata: session.user.user_metadata,
            full_name: session.user.user_metadata?.full_name,
          };
          setUser(userData);
          setUserRole(await fetchUserRole(session.user.id));
        }
      } catch (error) {
        if (error instanceof AuthError) {
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      setLoading(true);
      try {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            user_metadata: session.user.user_metadata,
            full_name: session.user.user_metadata?.full_name,
          };
          setUser(userData);
          setUserRole(await fetchUserRole(session.user.id));
          setError(null);
          
          if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
            toast({
              title: "Email verified",
              description: "Your email has been successfully verified.",
            });
            navigate('/');
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        if (error instanceof AuthError) {
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
      const cleanPassword = password; // Don't sanitize password as it may contain special chars
      
      // Basic validation
      if (!sanitizedEmail || !cleanPassword) {
        throw new Error('Email and password are required');
      }
      
      if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await supabase.auth.signInWithPassword({ 
        email: sanitizedEmail, 
        password: cleanPassword 
      });
      
      if (error) {
        await logSecurityEvent('failed_login', { email: sanitizedEmail, error: error.message });
        throw error;
      }
      
      await logSecurityEvent('successful_login', { email: sanitizedEmail });
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Sign in error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
      const sanitizedFullName = sanitizeInput(fullName.trim());
      
      // Validation
      if (!sanitizedEmail || !password || !sanitizedFullName) {
        throw new Error('All fields are required');
      }
      
      if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (sanitizedFullName.length < 2) {
        throw new Error('Full name must be at least 2 characters long');
      }

      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          data: { full_name: sanitizedFullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        await logSecurityEvent('failed_signup', { email: sanitizedEmail, error: error.message });
        throw error;
      }
      
      await logSecurityEvent('successful_signup', { email: sanitizedEmail });
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Sign up error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Password reset error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Password update error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Google sign in error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await logSecurityEvent('logout');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserRole(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    error,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInWithGoogle,
    updatePassword,
    isAdmin,
    isModerator,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
