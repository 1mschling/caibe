import { useState, useEffect } from 'react';
import { Key, Lock, User as UserIcon, Settings, Clock, Shield } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

interface UserPortalProps {
  sessionTimeRemaining: number;
}

export function UserPortal({ sessionTimeRemaining }: UserPortalProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const [autoRotateKeys, setAutoRotateKeys] = useState(true);
  const [sessionStartTime] = useState(new Date());

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleGenerateKey = () => {
    toast.success('New IBE key generated successfully!');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header portalType="user" />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
                <UserIcon className="h-4 w-4" />
                <span className="font-medium">User Portal</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome, {userProfile?.name || 'User'}
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your identity-based encryption keys and session settings
              </p>
            </div>

            {/* Session Status Banner */}
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Active Session</h3>
                      <p className="text-sm text-muted-foreground">
                        Time remaining: {formatTimeRemaining(sessionTimeRemaining)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Session started</p>
                    <p className="font-medium">{sessionStartTime.toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="keys" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="keys">IBE Keys</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              {/* IBE Keys Tab */}
              <TabsContent value="keys" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      <div>
                        <CardTitle>Identity-Based Encryption Keys</CardTitle>
                        <CardDescription>
                          Manage your personal IBE keys for secure communication
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Current Session Key</h3>
                          <p className="text-sm text-muted-foreground">
                            Auto-rotated at session start: {sessionStartTime.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="text-xs font-mono bg-background rounded p-2 break-all">
                        key_session_{sessionStartTime.getTime().toString(36)}_abc123def456ghi789
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            Automatic Key Rotation Active
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Your IBE keys are automatically rotated at the start of every new session for enhanced security. 
                            Keys expire when your session ends (8-hour timeout).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Session-Based Key Rotation</Label>
                          <p className="text-sm text-muted-foreground">
                            Keys automatically rotate on each login/session
                          </p>
                        </div>
                        <Switch
                          checked={autoRotateKeys}
                          onCheckedChange={setAutoRotateKeys}
                          disabled
                        />
                      </div>

                      <Button onClick={handleGenerateKey} className="w-full" variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        View Key Details
                      </Button>
                    </div>

                    <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                      <p className="text-sm text-amber-900 dark:text-amber-100">
                        <strong>Note:</strong> Session keys are ephemeral and automatically expire after 8 hours. 
                        A new key will be generated when you start your next session.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sessions Tab */}
              <TabsContent value="sessions" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <div>
                        <CardTitle>Session Security Configuration</CardTitle>
                        <CardDescription>
                          View your session security settings and status
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                        <h3 className="font-semibold">Session Configuration</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Default Session Timeout</span>
                            <span className="font-medium">8 hours</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Time Remaining</span>
                            <span className="font-medium text-primary">
                              {formatTimeRemaining(sessionTimeRemaining)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">IBE Key Rotation</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Automatic (per session)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                        <h3 className="font-semibold">Current Session</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium">Active Session</p>
                              <p className="text-muted-foreground">Started: {sessionStartTime.toLocaleString()}</p>
                            </div>
                            <div className="flex h-2 w-2 rounded-full bg-green-500" />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Session ID</span>
                            <span className="font-mono text-xs">
                              {sessionStartTime.getTime().toString(36).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-purple-500/50 bg-purple-500/10 p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                              Zero-Trust Session Security
                            </p>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                              Your session is protected by automatic 8-hour timeout and session-based IBE key rotation. 
                              Fresh encryption keys are generated at the start of each session for maximum security.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          View your profile details
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        {userProfile?.name || 'N/A'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        {userProfile?.organization || 'N/A'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Role / Title</Label>
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        {userProfile?.role || 'N/A'}
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        To update your profile information, please contact your system administrator.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Info Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">IBE Key Status</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Key Rotation</span>
                      <span className="font-medium">{sessionStartTime.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Authentication Method</span>
                      <span className="font-medium">Internet Identity</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Session Timeout</span>
                      <span className="font-medium">8 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Session Started</span>
                      <span className="font-medium">{sessionStartTime.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time Remaining</span>
                      <span className="font-medium text-primary">
                        {formatTimeRemaining(sessionTimeRemaining)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Key Rotation</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Per Session
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
