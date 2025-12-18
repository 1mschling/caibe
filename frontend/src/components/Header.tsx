import { Moon, Sun, LogOut, User, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps {
  portalType: 'admin' | 'user';
  sessionTimeRemaining?: number;
}

export function Header({ portalType, sessionTimeRemaining }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetCallerUserRole();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const formatTimeRemaining = (ms?: number) => {
    if (!ms) return '';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">
                {portalType === 'admin' ? 'CAIBE Admin Console' : 'CAIBE User Portal'}
              </h1>
              <p className="text-xs text-muted-foreground">
                Certificate Authority + Identity Based Encryption
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {sessionTimeRemaining !== undefined && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Session: {formatTimeRemaining(sessionTimeRemaining)}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{userProfile?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.organization || 'Organization'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">Role</span>
                  <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="ml-2">
                    {userRole || 'guest'}
                  </Badge>
                </div>
              </DropdownMenuItem>
              {sessionTimeRemaining !== undefined && (
                <DropdownMenuItem disabled className="md:hidden">
                  <div className="flex items-center gap-2 w-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Session: {formatTimeRemaining(sessionTimeRemaining)}</span>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
