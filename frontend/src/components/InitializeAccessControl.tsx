import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useInitializeAccessControl } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Shield, Loader2, CheckCircle2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function InitializeAccessControl() {
  const queryClient = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();
  const initializeMutation = useInitializeAccessControl();

  const isActorReady = !!actor && !actorFetching;

  const handleInitialize = async () => {
    if (!isActorReady) {
      return;
    }

    try {
      await initializeMutation.mutateAsync();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  };

  // After successful initialization, refetch the user role and redirect
  useEffect(() => {
    if (initializeMutation.isSuccess) {
      const timer = setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ['userRole'] });
        await queryClient.refetchQueries({ queryKey: ['userRole'] });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [initializeMutation.isSuccess, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Initialize Access Control</CardTitle>
            <CardDescription className="mt-2">
              Your account needs to be initialized with proper access permissions before you can use the CAIBE system.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Actor connection status - Connecting */}
          {actorFetching && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Wifi className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Connecting to backend server... Please wait.
              </AlertDescription>
            </Alert>
          )}

          {/* Actor connection status - Ready */}
          {!actorFetching && isActorReady && !initializeMutation.isPending && !initializeMutation.isSuccess && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Connected to backend server. Ready to initialize.
              </AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {initializeMutation.isSuccess && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Access control initialized successfully! Redirecting to your portal...
              </AlertDescription>
            </Alert>
          )}

          {/* Error message */}
          {initializeMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {initializeMutation.error instanceof Error 
                  ? initializeMutation.error.message 
                  : 'Failed to initialize access control. Please try again or contact your administrator.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Actor initialization error */}
          {!actorFetching && !isActorReady && !initializeMutation.isSuccess && (
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                Unable to establish connection to the backend server. Please refresh the page or contact your administrator.
              </AlertDescription>
            </Alert>
          )}

          {!initializeMutation.isSuccess && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <h3 className="font-semibold text-sm">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Your account will be assigned appropriate access permissions</li>
                  <li>You will be redirected to your designated portal (Admin or User)</li>
                  <li>You can start using CAIBE system features</li>
                </ul>
              </div>

              <Button
                onClick={handleInitialize}
                disabled={!isActorReady || initializeMutation.isPending}
                className="w-full"
                size="lg"
              >
                {actorFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to backend...
                  </>
                ) : initializeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Initialize Access Control
                  </>
                )}
              </Button>

              {!isActorReady && !actorFetching && (
                <p className="text-xs text-center text-destructive">
                  Backend connection failed. Please refresh the page to try again.
                </p>
              )}

              {actorFetching && (
                <p className="text-xs text-center text-muted-foreground">
                  Establishing secure connection to the backend server...
                </p>
              )}

              {isActorReady && !initializeMutation.isPending && (
                <p className="text-xs text-center text-green-600 dark:text-green-400">
                  Backend ready. Click the button above to initialize your access.
                </p>
              )}
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground">
            <p>This is a one-time setup process required for all new users.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

