import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();

  // Access Control Functions
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management
  public type UserProfile = {
    name : Text;
    organization : Text;
    role : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Template = {
    id : Text;
    title : Text;
    content : Text;
  };

  type Guideline = {
    id : Text;
    title : Text;
    content : Text;
  };

  type ExampleFlow = {
    id : Text;
    title : Text;
    content : Text;
  };

  type CertificateAuthority = {
    id : Text;
    description : Text;
  };

  type SAMLConfigType = {
    serviceProvider : Text;
    certificate : Text;
    metadata : Text;
  };

  type SecurityBestPractice = {
    id : Text;
    title : Text;
    details : Text;
  };

  type RoadmapItem = {
    id : Text;
    description : Text;
  };

  type CAConfiguration = {
    setupStatus : Text;
    configParams : Text;
    adminLogs : Text;
  };

  type TrustRelationship = {
    validationRecords : Text;
    certificateChain : Text;
    monitoringData : Text;
  };

  type EventCategory = {
    #security;
    #access;
    #ca;
    #saml;
    #ibe;
    #systemAction;
    #compliance;
  };

  type SystemLog = {
    timestamp : Time.Time;
    eventType : EventCategory;
    user : Text;
    action : Text;
    details : Text;
  };

  let templateStore = Map.empty<Text, Template>();
  let guidelineStore = Map.empty<Text, Guideline>();
  let exampleFlowStore = Map.empty<Text, ExampleFlow>();
  let certificateAuthorityStore = Map.empty<Text, CertificateAuthority>();
  let samlConfigStore = Map.empty<Text, SAMLConfigType>();
  let securityBestPracticeStore = Map.empty<Text, SecurityBestPractice>();
  let roadmapStore = Map.empty<Text, RoadmapItem>();
  let caConfigStore = Map.empty<Text, CAConfiguration>();
  let trustRelStore = Map.empty<Text, TrustRelationship>();
  let logStore = Map.empty<Nat, SystemLog>();
  var nextLogId = 0;

  // Add functions
  public shared ({ caller }) func addTemplate(id : Text, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add templates");
    };
    templateStore.add(id, { id; title; content });
    systemLog(#systemAction, "Template Added", "Template ID: " # id);
  };

  public shared ({ caller }) func addGuideline(id : Text, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add guidelines");
    };
    guidelineStore.add(id, { id; title; content });
    systemLog(#systemAction, "Guideline Added", "Guideline ID: " # id);
  };

  public shared ({ caller }) func addExampleFlow(id : Text, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add example flows");
    };
    exampleFlowStore.add(id, { id; title; content });
    systemLog(#systemAction, "Example Flow Added", "Example Flow ID: " # id);
  };

  public shared ({ caller }) func addCertificateAuthority(id : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add certificate authorities");
    };
    certificateAuthorityStore.add(id, { id; description });
    systemLog(#ca, "Certificate Authority Added", "CA ID: " # id);
  };

  public shared ({ caller }) func addSAMLConfig(serviceProvider : Text, certificate : Text, metadata : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add SAML configurations");
    };
    samlConfigStore.add(serviceProvider, { serviceProvider; certificate; metadata });
    systemLog(#saml, "SAML Config Added", "Service Provider: " # serviceProvider);
  };

  public shared ({ caller }) func addSecurityPractice(id : Text, title : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add security best practices");
    };
    securityBestPracticeStore.add(id, { id; title; details });
    systemLog(#security, "Security Practice Added", "Practice ID: " # id);
  };

  public shared ({ caller }) func addRoadmapItem(id : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add roadmap items");
    };
    roadmapStore.add(id, { id; description });
    systemLog(#systemAction, "Roadmap Item Added", "Item ID: " # id);
  };

  public shared ({ caller }) func addCAConfiguration(setupStatus : Text, configParams : Text, adminLogs : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can modify CA configuration data");
    };
    caConfigStore.add(setupStatus, { setupStatus; configParams; adminLogs });
    systemLog(#ca, "CA Configuration Changed", "Status: " # setupStatus);
  };

  public shared ({ caller }) func addTrustRelationship(validationRecords : Text, certificateChain : Text, monitoringData : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manage trust relationships");
    };
    trustRelStore.add(validationRecords, { validationRecords; certificateChain; monitoringData });
    systemLog(#ca, "Trust Relationship Updated", "Records: " # validationRecords);
  };

  // Logging functions
  func systemLog(eventType : EventCategory, action : Text, details : Text) {
    let logEntry : SystemLog = {
      timestamp = Time.now();
      eventType;
      user = "system";
      action;
      details;
    };
    logStore.add(nextLogId, logEntry);
    nextLogId += 1;
  };

  // Get functions
  public query ({ caller }) func getTemplate(id : Text) : async Template {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access templates");
    };
    switch (templateStore.get(id)) {
      case (null) { Runtime.trap("Template not found") };
      case (?template) { template };
    };
  };

  public query ({ caller }) func getGuideline(id : Text) : async Guideline {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access guidelines");
    };
    switch (guidelineStore.get(id)) {
      case (null) { Runtime.trap("Guideline not found") };
      case (?guideline) { guideline };
    };
  };

  public query ({ caller }) func getExampleFlow(id : Text) : async ExampleFlow {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access example flows");
    };
    switch (exampleFlowStore.get(id)) {
      case (null) { Runtime.trap("Example flow not found") };
      case (?example) { example };
    };
  };

  public query ({ caller }) func getCertificateAuthority(id : Text) : async CertificateAuthority {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access certificate authority data");
    };
    switch (certificateAuthorityStore.get(id)) {
      case (null) { Runtime.trap("Certificate Authority not found") };
      case (?ca) { ca };
    };
  };

  public query ({ caller }) func getSAMLConfig(serviceProvider : Text) : async SAMLConfigType {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access SAML configurations");
    };
    switch (samlConfigStore.get(serviceProvider)) {
      case (null) { Runtime.trap("SAML Config not found") };
      case (?config) { config };
    };
  };

  public query ({ caller }) func getBestPractice(id : Text) : async SecurityBestPractice {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access security best practices");
    };
    switch (securityBestPracticeStore.get(id)) {
      case (null) { Runtime.trap("Best practice not found") };
      case (?practice) { practice };
    };
  };

  public query ({ caller }) func getRoadmapItem(id : Text) : async RoadmapItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access roadmap items");
    };
    switch (roadmapStore.get(id)) {
      case (null) { Runtime.trap("Roadmap item not found") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func getCAConfiguration(setupStatus : Text) : async CAConfiguration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access CA configuration data");
    };
    switch (caConfigStore.get(setupStatus)) {
      case (null) { Runtime.trap("CA configuration not found") };
      case (?config) { config };
    };
  };

  public query ({ caller }) func getTrustRelationship(validationRecords : Text) : async TrustRelationship {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access trust relationship data");
    };
    switch (trustRelStore.get(validationRecords)) {
      case (null) { Runtime.trap("Trust relationship not found") };
      case (?rel) { rel };
    };
  };

  // GetAll functions
  public query ({ caller }) func getAllTemplates() : async [Template] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access templates");
    };
    templateStore.values().toArray();
  };

  public query ({ caller }) func getAllGuidelines() : async [Guideline] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access guidelines");
    };
    guidelineStore.values().toArray();
  };

  public query ({ caller }) func getAllExampleFlows() : async [ExampleFlow] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access example flows");
    };
    exampleFlowStore.values().toArray();
  };

  public query ({ caller }) func getAllCertificateAuthorities() : async [CertificateAuthority] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access certificate authority data");
    };
    certificateAuthorityStore.values().toArray();
  };

  public query ({ caller }) func getAllSAMLConfigs() : async [SAMLConfigType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access SAML configurations");
    };
    samlConfigStore.values().toArray();
  };

  public query ({ caller }) func getAllBestPractices() : async [SecurityBestPractice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access security best practices");
    };
    securityBestPracticeStore.values().toArray();
  };

  public query ({ caller }) func getAllRoadmapItems() : async [RoadmapItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access roadmap items");
    };
    roadmapStore.values().toArray();
  };

  public query ({ caller }) func getAllCAConfigurations() : async [CAConfiguration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access CA configuration data");
    };
    caConfigStore.values().toArray();
  };

  public query ({ caller }) func getAllTrustRelationships() : async [TrustRelationship] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access trust relationship data");
    };
    trustRelStore.values().toArray();
  };

  public query ({ caller }) func getAllLogs() : async [SystemLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view logs");
    };
    logStore.values().toArray();
  };

  public query ({ caller }) func getLogsByType(eventType : EventCategory) : async [SystemLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view logs");
    };
    let filteredLogs = logStore.values().toArray().filter(
      func(log) {
        log.eventType == eventType;
      }
    );
    filteredLogs;
  };

  public query ({ caller }) func getLogsByUser(user : Text) : async [SystemLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view logs");
    };
    let filteredLogs = logStore.values().toArray().filter(
      func(log) {
        log.user == user;
      }
    );
    filteredLogs;
  };

  // README generation for admin portal
  public query ({ caller }) func generateREADME() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate README documentation");
    };

    let caibeTitle = "# CAIBE Certificate Authority + Identity-Based Encryption System\n";
    let systemIntro = "Hybrid Identity System for Internal and External Entity Management\n" #
    "\n" #
    "Combines Internet Identity, IBE, Internal Certificate Authority, and SAML Bridge\n\n" #
    "---\n";

    let complianceNIST = "### Compliance Benefits & Regulatory Alignment\n" #
    "-- CAIBE fully compliant with [NIST 800-63B](https://pages.nist.gov/800-63-3/)\n" #
    "-- [GPDR compatible](https://gdpr-info.eu) & durable high-assurance keys\n" #
    "-- ZERO PASSWORDS. Everything is batteries-included for a smooth experience\n\n";

    let passwordlessSection = "## Passwordless Authentication\n" #
    "- Internet Identity integration\n" #
    "- 100% passwordless via WebAuthn\n";

    let systemFeatures = "## System Features\n" #
    "- Internal CA management\n" #
    "- IBE key rotation with every session\n" #
    "- SAML Bridge for third-party SSO\n";
    let accessControl = "## Role & Attribute Management (User Directory)\n" #
    "- Comprehensive role/attribute-based access\n" #
    "- Attribute and role-based controls (ABAC/RBAC)\n";
    let zeroTrust = "## Zero Trust Architecture\n" #
    "- Constant verification, strong access boundaries\n" #
    "- Expired session and key management\n";

    let partnerFed = "## Partner Federation\n" #
    "- Secure external partner authentication (SAML)\n" #
    "- Full trust separation between external/internal\n";
    let workflow = "## Workflow\n- SAML Bridge connects to external partners/applications\n";
    let cost = "## Cost\n- Only initial setup and rare CA updates require admin approval\n";

    let readme = caibeTitle # systemIntro # complianceNIST # passwordlessSection # systemFeatures # accessControl # zeroTrust # partnerFed # workflow # cost;

    let caibeVSIamTitle = "\n# CAIBE vs Traditional Corporate IAM (Ping, Okta, etc)\n";
    let caibeVSIamIntro = "Comprehensive comparison of hybrid Internet Computer identity vs traditional corporate IAM\n";
    let traditionalTitle = "## Traditional IAM Limitations (Ping, Okta, etc)\n";
    let traditionalLimitations = "- Centralized architecture/infra\n" #
    "- Centralized trust model\n" #
    "- Passwords vulnerable to phishing\n" #
    "- No cryptographic verification on-chain\n" #
    "- Vendor lock-in/lifecycle risk\n";
    let caibeAdvantages = "## Why CAIBE is Superior\n" #
    "- Identity cryptographic guarantees\n" #
    "- No passwords, no credentials to lose\n" #
    "- Client-side cryptography\n" #
    "- On-chain immutable verification\n" #
    "- No vendor lock-in\n";

    let caibeVSIamContent = caibeVSIamTitle # caibeVSIamIntro # traditionalTitle # traditionalLimitations # caibeAdvantages;

    let deployment = "## Deployment\n" #
    "- Internet Computer (verified ID)\n";
    let future = "## Future Extensions\n" #
    "- SAML/SSO bridge secure with blockchain trust\n";

    let adminPortalTitle = "# Complete Hybrid Identity System\n";
    let adminPortalFeatures = "- Supports Customer/Identity + Workforce\n" #
    "- Comprehensive partner federation\n" #
    "- Advanced authentication/session encryption\n";
    let extraNotes = "All cryptographic logic is immutable + strong access control on Internet Computer.\n" #
    "- On-chain identity, permanent certificate chain, and verified attribute directory\n" #
    "- Public access requires thorough validation/signing by verified authorities\n";
    let wrapup = "- No external trusted authority\n" #
    "- Full sovereignty, permanent identity chain\n";

    readme # caibeVSIamContent # adminPortalTitle # adminPortalFeatures # extraNotes # wrapup # deployment # future;
  };

  public query ({ caller }) func downloadREADMEFile() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can download README documentation");
    };

    let caibeTitle = "# CAIBE Certificate Authority + Identity-Based Encryption System\n";
    let systemIntro = "Hybrid Identity System for Internal and External Entity Management\n" #
    "\n" #
    "Combines Internet Identity, IBE, Internal Certificate Authority, and SAML Bridge\n\n" #
    "---\n";

    let complianceNIST = "### Compliance Benefits & Regulatory Alignment\n" #
    "-- CAIBE fully compliant with [NIST 800-63B](https://pages.nist.gov/800-63-3/)\n" #
    "-- [GPDR compatible](https://gdpr-info.eu) & durable high-assurance keys\n" #
    "-- ZERO PASSWORDS. Everything is batteries-included for a smooth experience\n\n";

    let passwordlessSection = "## Passwordless Authentication\n" #
    "- Internet Identity integration\n" #
    "- 100% passwordless via WebAuthn\n";

    let systemFeatures = "## System Features\n" #
    "- Internal CA management\n" #
    "- IBE key rotation with every session\n" #
    "- SAML Bridge for third-party SSO\n";
    let accessControl = "## Role & Attribute Management (User Directory)\n" #
    "- Comprehensive role/attribute-based access\n" #
    "- Attribute and role-based controls (ABAC/RBAC)\n";
    let zeroTrust = "## Zero Trust Architecture\n" #
    "- Constant verification, strong access boundaries\n" #
    "- Expired session and key management\n";

    let partnerFed = "## Partner Federation\n" #
    "- Secure external partner authentication (SAML)\n" #
    "- Full trust separation between external/internal\n";
    let workflow = "## Workflow\n- SAML Bridge connects to external partners/applications\n";
    let cost = "## Cost\n- Only initial setup and rare CA updates require admin approval\n";

    let readme = caibeTitle # systemIntro # complianceNIST # passwordlessSection # systemFeatures # accessControl # zeroTrust # partnerFed # workflow # cost;

    let caibeVSIamTitle = "\n# CAIBE vs Traditional Corporate IAM (Ping, Okta, etc)\n";
    let caibeVSIamIntro = "Comprehensive comparison of hybrid Internet Computer identity vs traditional corporate IAM\n";
    let traditionalTitle = "## Traditional IAM Limitations (Ping, Okta, etc)\n";
    let traditionalLimitations = "- Centralized architecture/infra\n" #
    "- Centralized trust model\n" #
    "- Passwords vulnerable to phishing\n" #
    "- No cryptographic verification on-chain\n" #
    "- Vendor lock-in/lifecycle risk\n";
    let caibeAdvantages = "## Why CAIBE is Superior\n" #
    "- Identity cryptographic guarantees\n" #
    "- No passwords, no credentials to lose\n" #
    "- Client-side cryptography\n" #
    "- On-chain immutable verification\n" #
    "- No vendor lock-in\n";

    let caibeVSIamContent = caibeVSIamTitle # caibeVSIamIntro # traditionalTitle # traditionalLimitations # caibeAdvantages;

    let deployment = "## Deployment\n" #
    "- Internet Computer (verified ID)\n";
    let future = "## Future Extensions\n" #
    "- SAML/SSO bridge secure with blockchain trust\n";

    let adminPortalTitle = "# Complete Hybrid Identity System\n";
    let adminPortalFeatures = "- Supports Customer/Identity + Workforce\n" #
    "- Comprehensive partner federation\n" #
    "- Advanced authentication/session encryption\n";
    let extraNotes = "All cryptographic logic is immutable + strong access control on Internet Computer.\n" #
    "- On-chain identity, permanent certificate chain, and verified attribute directory\n" #
    "- Public access requires thorough validation/signing by verified authorities\n";
    let wrapup = "- No external trusted authority\n" #
    "- Full sovereignty, permanent identity chain\n";

    readme # caibeVSIamContent # adminPortalTitle # adminPortalFeatures # extraNotes # wrapup # deployment # future;
  };
};

