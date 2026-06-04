import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

export function LogoutPage() {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true });
      },
      onError: () => {
        // Even if logout API fails, clear local state and redirect
        navigate('/login', { replace: true });
      },
    });
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
}
