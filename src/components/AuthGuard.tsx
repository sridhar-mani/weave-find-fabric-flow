
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from './auth/LoginForm';
import { Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showModal?: boolean;
  onModalClose?: () => void;
  title?: string;
  description?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  showModal = false,
  onModalClose,
  title = "Sign in required",
  description = "You need to be signed in to access this feature."
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) {
    if (showModal) {
      return (
        <Dialog open={true} onOpenChange={onModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {title}
              </DialogTitle>
              <DialogDescription>
                {description}
              </DialogDescription>
            </DialogHeader>
            <LoginForm onSuccess={onModalClose} />
          </DialogContent>
        </Dialog>
      );
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-xl font-semibold text-stone-800 mb-2">{title}</h3>
        <p className="text-stone-600 mb-6">{description}</p>
        <LoginForm />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
