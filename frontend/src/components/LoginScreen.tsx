import { Shield, Lock, Key, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export function LoginScreen() {
  const { login, loginStatus, clear } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">CAIBE System</h1>
              <p className="text-xs text-muted-foreground">Certificate Authority + IBE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Side - Information */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Hybrid Identity System
                </h2>
                <p className="text-xl text-muted-foreground">
                  Comprehensive authentication, authorization, and access management with Zero-Trust security
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Internet Identity Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Passwordless authentication using WebAuthn and biometrics
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Lock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Identity-Based Encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      Ephemeral session keys with perfect forward secrecy
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Internal Certificate Authority</h3>
                    <p className="text-sm text-muted-foreground">
                      X.509 certificates and SAML assertion signing
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Partner Federation</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure identity federation with external partners via SAML
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-2xl">Welcome to CAIBE</CardTitle>
                  <CardDescription>
                    Sign in with Internet Identity to access the documentation system and manage your hybrid identity infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                    <h4 className="font-medium text-sm">Zero-Trust Security</h4>
                    <p className="text-xs text-muted-foreground">
                      All access requires authentication. No implicit trust based on network location.
                    </p>
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Login with Internet Identity
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By logging in, you agree to our security policies and zero-trust access controls
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="container py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
