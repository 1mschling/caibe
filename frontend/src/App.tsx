import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { LoginScreen } from './components/LoginScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { AdminPortal } from './components/AdminPortal';
import { UserPortal } from './components/UserPortal';
import { InitializeAccessControl } from './components/InitializeAccessControl';
import { FallbackNotice } from './components/FallbackNotice';
import { Toaster } from './components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from './hooks/useQueries';
import { useSessionTimeout } from './hooks/useSessionTimeout';

const queryClient = new QueryClient();

function AppContent() {
  const { identity, isInitializing, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  
  // Session timeout management (8 hours) - convert undefined to null for type compatibility
  const { timeRemaining, isExpired } = useSessionTimeout(identity ?? null);

  const isAuthenticated = !!identity;

  // Handle session expiration
  useEffect(() => {
    if (isExpired && isAuthenticated) {
      clear();
      queryClient.clear();
    }
  }, [isExpired, isAuthenticated, clear]);

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show profile setup if user has no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  // Show loading while fetching role
  if (roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    );
  }

  // Show initialization screen for uninitialized users (guest role or undefined)
  if (!userRole || userRole === 'guest') {
    return <InitializeAccessControl />;
  }

  // Route to appropriate portal based on role
  if (userRole === 'admin') {
    return (
      <>
        <FallbackNotice />
        <AdminPortal sessionTimeRemaining={timeRemaining} />
      </>
    );
  } else if (userRole === 'user') {
    return (
      <>
        <FallbackNotice />
        <UserPortal sessionTimeRemaining={timeRemaining} />
      </>
    );
  }

  // Fallback for unknown roles
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold">Access Not Configured</h1>
        <p className="text-muted-foreground max-w-md">
          Your account role is not properly configured. Please contact your administrator for assistance.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
