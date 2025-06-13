
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ 
  children, 
  fallback,
  requiredRole = 'admin'
}) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <Alert className="m-4">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Please sign in to access this page.
        </AlertDescription>
      </Alert>
    );
  }

  const hasRequiredRole = requiredRole === 'admin' 
    ? userRole === 'admin' 
    : userRole === 'admin' || userRole === 'moderator';

  if (!hasRequiredRole) {
    return fallback || (
      <Alert className="m-4" variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this page. {requiredRole} role required.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
