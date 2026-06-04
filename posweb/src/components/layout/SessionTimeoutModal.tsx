import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLogout } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SessionTimeoutModalProps {
  open: boolean;
  onStayLoggedIn: () => void;
  minutesRemaining?: number;
}

export function SessionTimeoutModal({
  open,
  onStayLoggedIn,
  minutesRemaining = 5,
}: SessionTimeoutModalProps) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onStayLoggedIn()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
          <DialogDescription>
            Your session will expire in {minutesRemaining} minutes due to inactivity.
            Would you like to stay logged in?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            Log Out Now
          </Button>
          <Button
            onClick={onStayLoggedIn}
            disabled={isLoggingOut}
          >
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage session timeout
export function useSessionTimeout(timeoutMinutes: number = 30) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningTime, setWarningTime] = useState(5); // Show warning 5 minutes before timeout

  React.useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;

    const resetTimers = () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      clearTimeout(timeoutTimer);

      setShowWarning(false);

      // Show warning after (timeout - warningTime) minutes
      warningTimer = setTimeout(() => {
        setShowWarning(true);
      }, (timeoutMinutes - warningTime) * 60 * 1000);

      // Force logout after timeout minutes
      timeoutTimer = setTimeout(() => {
        // Handle forced logout
        console.log('Session timed out');
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset timers on user activity
    const handleActivity = () => {
      resetTimers();
    };

    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimers();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      clearTimeout(timeoutTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [timeoutMinutes]);

  return { showWarning, setShowWarning };
}
