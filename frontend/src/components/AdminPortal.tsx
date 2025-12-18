import { Header } from './Header';
import { Footer } from './Footer';
import { SectionManager } from './SectionManager';
import { SystemLogs } from './SystemLogs';
import { DocumentationGenerator } from './DocumentationGenerator';
import { Settings, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AdminPortalProps {
  sessionTimeRemaining: number;
}

export function AdminPortal({ sessionTimeRemaining }: AdminPortalProps) {
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header portalType="admin" sessionTimeRemaining={sessionTimeRemaining} />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-primary/10 px-4 py-1.5 text-sm">
                <Settings className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Admin Console</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                CAIBE Admin Portal
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Manage content, monitor system activity, and configure CAIBE identity infrastructure
              </p>
            </div>

            {/* Primary Section: Manage Content - Prominently Positioned */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Manage Content</CardTitle>
                    <CardDescription className="text-base">
                      Configure templates, guidelines, certificate authorities, and SAML settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <SectionManager />
              </CardContent>
            </Card>

            {/* System Activity Logging Section */}
            <Card className="border-2 border-blue-500/20 shadow-lg">
              <CardHeader className="bg-blue-500/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">System Activity Logs</CardTitle>
                    <CardDescription className="text-base">
                      Monitor security events, access changes, CA operations, and system activities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <SystemLogs />
              </CardContent>
            </Card>

            {/* Secondary Tools - Collapsible Section */}
            <Collapsible open={isSecondaryOpen} onOpenChange={setIsSecondaryOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Documentation & System Tools</CardTitle>
                          <CardDescription>
                            Generate documentation, view architecture diagrams, and access system configuration
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            isSecondaryOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <DocumentationGenerator />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Quick Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CAIBE vs Traditional IAM</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Decentralized, passwordless architecture with on-chain security versus traditional centralized IAM systems
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CA-IBE Trust Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Certificate Authority certifies public IBE identities for organizational trust without holding private keys
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Zero-Trust Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Continuous verification with session-based key rotation and strict boundary enforcement
                  </p>
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
