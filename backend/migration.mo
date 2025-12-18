import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldEventCategory = {
    #security;
    #access;
    #ca;
    #saml;
    #ibe;
    #systemAction;
  };

  type OldSystemLog = {
    timestamp : Time.Time;
    eventType : OldEventCategory;
    user : Text;
    action : Text;
    details : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      organization : Text;
      role : Text;
    }>;
    templateStore : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
    }>;
    guidelineStore : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
    }>;
    exampleFlowStore : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
    }>;
    certificateAuthorityStore : Map.Map<Text, {
      id : Text;
      description : Text;
    }>;
    samlConfigStore : Map.Map<Text, {
      serviceProvider : Text;
      certificate : Text;
      metadata : Text;
    }>;
    securityBestPracticeStore : Map.Map<Text, {
      id : Text;
      title : Text;
      details : Text;
    }>;
    roadmapStore : Map.Map<Text, {
      id : Text;
      description : Text;
    }>;
    caConfigStore : Map.Map<Text, {
      setupStatus : Text;
      configParams : Text;
      adminLogs : Text;
    }>;
    logStore : Map.Map<Nat, OldSystemLog>;
    nextLogId : Nat;
    trustRelStore : Map.Map<Text, {
      validationRecords : Text;
      certificateChain : Text;
      monitoringData : Text;
    }>;
  };

  type NewEventCategory = {
    #security;
    #access;
    #ca;
    #saml;
    #ibe;
    #systemAction;
    #compliance;
  };

  type NewSystemLog = {
    timestamp : Time.Time;
    eventType : NewEventCategory;
    user : Text;
    action : Text;
    details : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      organization : Text;
      role : Text;
    }>;
    templateStore : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
    }>;
    guidelineStore : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
    }>;
    exampleFlowStore : Map.Map<Text, {
      id : Text;
      title : Text;
      content : Text;
    }>;
    certificateAuthorityStore : Map.Map<Text, {
      id : Text;
      description : Text;
    }>;
    samlConfigStore : Map.Map<Text, {
      serviceProvider : Text;
      certificate : Text;
      metadata : Text;
    }>;
    securityBestPracticeStore : Map.Map<Text, {
      id : Text;
      title : Text;
      details : Text;
    }>;
    roadmapStore : Map.Map<Text, {
      id : Text;
      description : Text;
    }>;
    caConfigStore : Map.Map<Text, {
      setupStatus : Text;
      configParams : Text;
      adminLogs : Text;
    }>;
    logStore : Map.Map<Nat, NewSystemLog>;
    nextLogId : Nat;
    trustRelStore : Map.Map<Text, {
      validationRecords : Text;
      certificateChain : Text;
      monitoringData : Text;
    }>;
  };

  func migrateEventCategory(oldCategory : OldEventCategory) : NewEventCategory {
    switch (oldCategory) {
      case (#security) { #security };
      case (#access) { #access };
      case (#ca) { #ca };
      case (#saml) { #saml };
      case (#ibe) { #ibe };
      case (#systemAction) { #systemAction };
    };
  };

  func migrateSystemLog(oldLog : OldSystemLog) : NewSystemLog {
    {
      oldLog with
      eventType = migrateEventCategory(oldLog.eventType)
    };
  };

  func migrateLogStore(oldLogStore : Map.Map<Nat, OldSystemLog>) : Map.Map<Nat, NewSystemLog> {
    oldLogStore.map<Nat, OldSystemLog, NewSystemLog>(func(_k, v) { migrateSystemLog(v) });
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      logStore = migrateLogStore(old.logStore);
    };
  };
};
