import { useState, useEffect } from 'react';
import type { Identity } from '@dfinity/agent';
import { toast } from 'sonner';

const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const WARNING_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes warning
const SESSION_START_KEY = 'caibe_session_start';
const SESSION_WARNING_SHOWN_KEY = 'caibe_session_warning_shown';

export function useSessionTimeout(identity: Identity | null) {
  const [timeRemaining, setTimeRemaining] = useState<number>(SESSION_TIMEOUT_MS);
  const [isExpired, setIsExpired] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (!identity) {
      // Clear session data when logged out
      localStorage.removeItem(SESSION_START_KEY);
      localStorage.removeItem(SESSION_WARNING_SHOWN_KEY);
      setTimeRemaining(SESSION_TIMEOUT_MS);
      setIsExpired(false);
      setWarningShown(false);
      return;
    }

    // Initialize session start time
    const storedSessionStart = localStorage.getItem(SESSION_START_KEY);
    const sessionStart = storedSessionStart ? parseInt(storedSessionStart, 10) : Date.now();
    
    if (!storedSessionStart) {
      localStorage.setItem(SESSION_START_KEY, sessionStart.toString());
      localStorage.removeItem(SESSION_WARNING_SHOWN_KEY);
      // Trigger IBE key rotation on new session
      console.log('New session started - IBE keys will be rotated automatically');
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStart;
      const remaining = SESSION_TIMEOUT_MS - elapsed;

      setTimeRemaining(Math.max(0, remaining));

      // Show warning when approaching timeout
      if (remaining <= WARNING_THRESHOLD_MS && remaining > 0 && !warningShown) {
        const warningShownBefore = localStorage.getItem(SESSION_WARNING_SHOWN_KEY);
        if (!warningShownBefore) {
          const minutesRemaining = Math.ceil(remaining / 60000);
          toast.warning(`Session Expiring Soon`, {
            description: `Your session will expire in ${minutesRemaining} minutes. Please save your work.`,
            duration: 10000,
          });
          setWarningShown(true);
          localStorage.setItem(SESSION_WARNING_SHOWN_KEY, 'true');
        }
      }

      // Handle session expiration
      if (remaining <= 0) {
        setIsExpired(true);
        toast.error('Session Expired', {
          description: 'Your session has expired. Please log in again.',
          duration: 5000,
        });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [identity, warningShown]);

  return {
    timeRemaining,
    isExpired,
    sessionTimeoutMs: SESSION_TIMEOUT_MS,
  };
}
