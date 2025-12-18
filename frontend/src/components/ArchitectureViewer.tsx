import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

export function ArchitectureViewer() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CAIBE Architecture Diagrams</CardTitle>
          <CardDescription>
            Visual representation of the hybrid identity system architecture with dual-portal design, CA-IBE trust relationship, traditional IAM comparison, compliance alignment, and workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="comparison">IAM Comparison</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="ca-ibe">CA-IBE Trust</TabsTrigger>
              <TabsTrigger value="portals">Portals</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ciam">CIAM</TabsTrigger>
              <TabsTrigger value="partner">Partner</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CAIBE vs Traditional IAM Systems</h3>
                  <img
                    src="/assets/generated/caibe-vs-traditional-iam-comparison.dim_1024x768.png"
                    alt="CAIBE vs Traditional IAM Comparison"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Comprehensive comparison showing CAIBE's decentralized, passwordless architecture with on-chain security versus traditional centralized IAM systems (Ping, Okta) with password-based authentication and vendor lock-in
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CAIBE Advantages Architecture</h3>
                  <img
                    src="/assets/generated/caibe-advantages-architecture.dim_1024x768.png"
                    alt="CAIBE Advantages"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Detailed architecture highlighting CAIBE's key advantages: decentralized passwordless authentication, Identity-Based Encryption with no key escrow, self-sovereign Certificate Authority, zero-trust enforcement, and on-chain security guarantees
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                  <h3 className="font-semibold mb-4 text-lg">Key Differentiators</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-primary">Traditional IAM Limitations</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Password-based authentication</li>
                        <li>• Centralized vendor infrastructure</li>
                        <li>• Key escrow by third parties</li>
                        <li>• Off-chain security (no verifiability)</li>
                        <li>• Vendor lock-in and licensing fees</li>
                        <li>• Complex federation setup</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-secondary">CAIBE Advantages</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Passwordless (WebAuthn + Internet Identity)</li>
                        <li>• Decentralized blockchain architecture</li>
                        <li>• Client-side keys, no escrow</li>
                        <li>• On-chain cryptographic verification</li>
                        <li>• No vendor lock-in, open-source</li>
                        <li>• Simplified cryptographic trust</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CAIBE Compliance-Aligned Architecture</h3>
                  <img
                    src="/assets/generated/caibe-architecture-compliance-aligned.dim_1024x768.png"
                    alt="CAIBE Compliance Architecture"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Complete architecture showing cryptographically verifiable compliance through on-chain identity events, supporting GDPR, SOC 2, ISO 27001, NIST 800-63, and FIDO2 standards alignment
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CA-IBE Trust with Compliance Integration</h3>
                  <img
                    src="/assets/generated/caibe-ca-ibe-trust-compliance.dim_1024x768.png"
                    alt="CA-IBE Trust Compliance"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    CA-IBE trust relationship integrated with compliance logging showing how certificate operations and IBE identity certifications support regulatory compliance requirements
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-gradient-to-br from-green-500/5 to-blue-500/5 p-6">
                  <h3 className="font-semibold mb-4 text-lg">Compliance Benefits</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-green-600 dark:text-green-400">Regulatory Alignment</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• GDPR: Cryptographic privacy guarantees</li>
                        <li>• SOC 2: Verifiable security controls</li>
                        <li>• ISO 27001: Comprehensive ISMS</li>
                        <li>• NIST 800-63: Passwordless AAL2/AAL3</li>
                        <li>• FIDO2: WebAuthn compliance</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Compliance Advantages</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• On-chain cryptographic verification</li>
                        <li>• Immutable audit trails</li>
                        <li>• Real-time compliance monitoring</li>
                        <li>• Automated compliance reporting</li>
                        <li>• Mathematical proof of controls</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-amber-500/5 p-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <span className="text-amber-600 dark:text-amber-400">⚡</span>
                    Compliance Note
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    CAIBE's compliance benefits are integrated throughout the system architecture. All identity operations, certificate issuance, and access control decisions are logged on-chain with cryptographic verification, providing auditors with mathematical proof of compliance rather than relying on vendor attestations.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ca-ibe" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CA-IBE Trust Relationship</h3>
                  <img
                    src="/assets/generated/caibe-architecture-ca-ibe-trust.dim_1024x768.png"
                    alt="CA-IBE Trust Relationship"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Certificate Authority signs and certifies user session public IBE identities, providing organizational trust assurance within internal PKI while maintaining end-to-end encryption. Private keys remain client-side.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CA Administration and Configuration Flow</h3>
                  <img
                    src="/assets/generated/caibe-architecture-ca-admin-flow.dim_1024x768.png"
                    alt="CA Administration Flow"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Admin-required CA initialization and configuration workflow showing setup of CA keys, trust parameters, certificate policies, and automated ongoing operations
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CIAM with CA-IBE Trust Integration</h3>
                  <img
                    src="/assets/generated/caibe-ciam-ca-ibe-trust.dim_1024x768.png"
                    alt="CIAM with CA-IBE Trust"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    User Directory integration with CA-IBE trust relationship showing how public IBE identities are certified for both internal and external users
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portals" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">Dual Portal Architecture</h3>
                  <img
                    src="/assets/generated/caibe-architecture-dual-portals.dim_1024x768.png"
                    alt="CAIBE Dual Portal Architecture"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Complete CAIBE system showing Admin Portal (full access) and User Portal (limited access) with role-based routing
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CIAM with Dual Portals</h3>
                  <img
                    src="/assets/generated/caibe-ciam-dual-portals.dim_1024x768.png"
                    alt="CIAM with Dual Portals"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    User Directory managing internal and external users with portal access control based on assigned roles
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">Partner Federation with Portal Restrictions</h3>
                  <img
                    src="/assets/generated/caibe-federation-dual-portals.dim_1024x768.png"
                    alt="Partner Federation with Dual Portals"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Partner users classified as external entities with User Portal access only, ensuring strict separation from administrative functions
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">Complete Architecture</h3>
                  <img
                    src="/assets/generated/caibe-architecture-diagram-corrected.dim_1024x768.png"
                    alt="CAIBE Architecture Diagram"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Complete CAIBE system showing Internet Identity, User Directory, IBE PKG, Internal CA, and SAML Bridge components
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ciam" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3">CIAM Integration</h3>
                  <img
                    src="/assets/generated/caibe-architecture-with-ciam-corrected.dim_1024x768.png"
                    alt="CAIBE with CIAM"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-3">
                    Architecture showing User Directory integration for Customer Identity and Access Management
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="partner" className="mt-6">
              <ScrollArea className="h-[800px]">
                <div className="space-y-6 pr-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">Partner Federation Architecture</h3>
                    <img
                      src="/assets/generated/caibe-architecture-with-partner-federation-corrected.dim_1024x768.png"
                      alt="Partner Federation Architecture"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      Complete architecture with partner federation showing external entity integration via SAML
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">CIAM with Partner Federation</h3>
                    <img
                      src="/assets/generated/caibe-architecture-ciam-partner-federation-corrected.dim_1024x768.png"
                      alt="CIAM with Partner Federation"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      User Directory managing both internal users and external partner entities with strict separation
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">Standard Authentication Flow</h3>
                    <img
                      src="/assets/generated/caibe-sequence-flow.dim_1024x600.png"
                      alt="CAIBE Sequence Flow"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      End-to-end sequence showing user authentication, IBE key derivation, and application access
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">CIAM Workflow</h3>
                    <img
                      src="/assets/generated/caibe-sequence-flow-with-ciam.dim_1024x600.png"
                      alt="CIAM Sequence Flow"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      Sequence flow including User Directory interactions for role and attribute management
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">Partner Federation Flow</h3>
                    <img
                      src="/assets/generated/caibe-sequence-partner-federation-corrected.dim_1024x600.png"
                      alt="Partner Federation Sequence"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      Partner user authentication with external entity classification and CA-signed SAML assertions
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">SAML Bridge Integration</h3>
                    <img
                      src="/assets/generated/saml-bridge-integration.dim_800x600.png"
                      alt="SAML Bridge"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      SAML Bridge workflow for third-party application integration
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">SAML with Role Mapping</h3>
                    <img
                      src="/assets/generated/saml-bridge-with-role-mapping-corrected.dim_800x600.png"
                      alt="SAML with Role Mapping"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      SAML Bridge with role mapping for application-specific authorization
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
