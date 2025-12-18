import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Template, Guideline, ExampleFlow, CertificateAuthority, SAMLConfigType, UserProfile, SecurityBestPractice, RoadmapItem, UserRole, SystemLog, EventCategory } from '../backend';
import { isCertificateVerificationError, activateFallback } from '../lib/canisterFallback';

/**
 * Wrapper for query functions that handles certificate verification errors
 */
async function withFallbackRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isCertificateVerificationError(error)) {
      console.warn('Certificate verification failed in query, activating fallback');
      activateFallback();
      // Trigger a page reload to reinitialize with fallback mode
      window.location.reload();
      throw error;
    }
    throw error;
  }
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withFallbackRetry(() => actor.getCallerUserProfile());
    },
    enabled: !!actor && !actorFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.saveCallerUserProfile(profile));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withFallbackRetry(() => actor.getCallerUserRole());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return withFallbackRetry(() => actor.isCallerAdmin());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.initializeAccessControl());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// Template Queries
export function useGetAllTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllTemplates());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addTemplate(id, title, content));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// Guideline Queries
export function useGetAllGuidelines() {
  const { actor, isFetching } = useActor();

  return useQuery<Guideline[]>({
    queryKey: ['guidelines'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllGuidelines());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddGuideline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addGuideline(id, title, content));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guidelines'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// Example Flow Queries
export function useGetAllExampleFlows() {
  const { actor, isFetching } = useActor();

  return useQuery<ExampleFlow[]>({
    queryKey: ['exampleFlows'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllExampleFlows());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddExampleFlow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addExampleFlow(id, title, content));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exampleFlows'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// Certificate Authority Queries
export function useGetAllCertificateAuthorities() {
  const { actor, isFetching } = useActor();

  return useQuery<CertificateAuthority[]>({
    queryKey: ['certificateAuthorities'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllCertificateAuthorities());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddCertificateAuthority() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addCertificateAuthority(id, description));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificateAuthorities'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// SAML Config Queries
export function useGetAllSAMLConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<SAMLConfigType[]>({
    queryKey: ['samlConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllSAMLConfigs());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddSAMLConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceProvider, certificate, metadata }: { serviceProvider: string; certificate: string; metadata: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addSAMLConfig(serviceProvider, certificate, metadata));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['samlConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// Security Best Practices Queries
export function useGetAllBestPractices() {
  const { actor, isFetching } = useActor();

  return useQuery<SecurityBestPractice[]>({
    queryKey: ['bestPractices'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllBestPractices());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddSecurityPractice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, details }: { id: string; title: string; details: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addSecurityPractice(id, title, details));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bestPractices'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// Roadmap Queries
export function useGetAllRoadmapItems() {
  const { actor, isFetching } = useActor();

  return useQuery<RoadmapItem[]>({
    queryKey: ['roadmapItems'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllRoadmapItems());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

export function useAddRoadmapItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return withFallbackRetry(() => actor.addRoadmapItem(id, description));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmapItems'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// System Logs Queries
export function useGetAllLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<SystemLog[]>({
    queryKey: ['logs'],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getAllLogs());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
}

export function useGetLogsByType(eventType: EventCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<SystemLog[]>({
    queryKey: ['logs', eventType],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getLogsByType(eventType));
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
}

export function useGetLogsByUser(user: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SystemLog[]>({
    queryKey: ['logs', 'user', user],
    queryFn: async () => {
      if (!actor) return [];
      return withFallbackRetry(() => actor.getLogsByUser(user));
    },
    enabled: !!actor && !isFetching && !!user,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}

// README Generation
export function useGenerateREADME() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['readme'],
    queryFn: async () => {
      if (!actor) return '';
      return withFallbackRetry(() => actor.generateREADME());
    },
    enabled: !!actor && !isFetching,
    retry: (failureCount, error) => {
      if (isCertificateVerificationError(error)) return false;
      return failureCount < 2;
    },
  });
}
