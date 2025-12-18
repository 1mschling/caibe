import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getFallbackState, markNoticeShown, isFallbackActive } from '../lib/canisterFallback';

/**
 * FallbackNotice Component
 * 
 * Displays a safety notice when fallback mode is activated for the first time.
 * Also shows a persistent indicator when fallback is active.
 */
export function FallbackNotice() {
  const [showDialog, setShowDialog] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkFallbackState = () => {
      const state = getFallbackState();
      setIsActive(state.isActive);
      
      // Show dialog if fallback is active but notice hasn't been shown
      if (state.isActive && !state.hasShownNotice) {
        setShowDialog(true);
      }
    };

    checkFallbackState();

    // Check periodically for fallback state changes
    const interval = setInterval(checkFallbackState, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = () => {
    markNoticeShown();
    setShowDialog(false);
  };

  return (
    <>
      {/* First-time notice dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Connection Fallback Activated
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left">
              <p>
                We detected a certificate verification issue with the standard connection method.
              </p>
              <p>
                <strong>Automatic Fallback:</strong> The application has automatically switched to using the raw canister domain (<code className="text-xs bg-muted px-1 py-0.5 rounded">.raw.icp0.io</code>) to ensure continued access.
              </p>
              <p>
                <strong>Security Notice:</strong> While this fallback method bypasses certificate verification, your data remains secure through the Internet Computer's consensus mechanism. This is a standard fallback procedure for handling network-level verification issues.
              </p>
              <p className="text-sm text-muted-foreground">
                The application will continue to function normally. You can safely proceed with your work.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAcknowledge}>
              I Understand, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Persistent indicator when fallback is active */}
      {isActive && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <Alert variant="default" className="rounded-none border-x-0 border-t-0 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-400">Fallback Mode Active</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-500 text-xs">
              Using raw canister domain for improved connectivity
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
