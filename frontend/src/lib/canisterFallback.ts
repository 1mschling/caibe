/**
 * Canister Fallback Handler
 * 
 * Detects certificate verification failures and automatically retries
 * requests using the raw canister domain (.raw.icp0.io) as a fallback.
 */

const FALLBACK_NOTICE_KEY = 'caibe_fallback_notice_shown';
const FALLBACK_ACTIVE_KEY = 'caibe_fallback_active';

export interface FallbackState {
  isActive: boolean;
  hasShownNotice: boolean;
}

/**
 * Check if an error is a certificate verification failure
 */
export function isCertificateVerificationError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  const errorString = errorMessage.toLowerCase();
  
  // Common certificate verification error patterns
  return (
    errorString.includes('certificate verification') ||
    errorString.includes('invalid certificate') ||
    errorString.includes('cert') && errorString.includes('verif') ||
    errorString.includes('signature verification failed') ||
    errorString.includes('unable to verify') ||
    error.name === 'CertificateVerificationError'
  );
}

/**
 * Get the current fallback state
 */
export function getFallbackState(): FallbackState {
  const isActive = localStorage.getItem(FALLBACK_ACTIVE_KEY) === 'true';
  const hasShownNotice = localStorage.getItem(FALLBACK_NOTICE_KEY) === 'true';
  
  return { isActive, hasShownNotice };
}

/**
 * Activate fallback mode
 */
export function activateFallback(): void {
  localStorage.setItem(FALLBACK_ACTIVE_KEY, 'true');
}

/**
 * Deactivate fallback mode
 */
export function deactivateFallback(): void {
  localStorage.removeItem(FALLBACK_ACTIVE_KEY);
}

/**
 * Mark that the fallback notice has been shown
 */
export function markNoticeShown(): void {
  localStorage.setItem(FALLBACK_NOTICE_KEY, 'true');
}

/**
 * Check if fallback is currently active
 */
export function isFallbackActive(): boolean {
  return localStorage.getItem(FALLBACK_ACTIVE_KEY) === 'true';
}

/**
 * Convert a standard IC domain to raw domain
 * Examples:
 * - https://xxxxx.icp0.io -> https://xxxxx.raw.icp0.io
 * - https://ic0.app -> https://raw.ic0.app
 */
export function convertToRawDomain(host: string): string {
  // If already using raw domain, return as-is
  if (host.includes('.raw.')) {
    return host;
  }
  
  // Convert icp0.io to raw.icp0.io
  if (host.includes('.icp0.io')) {
    return host.replace('.icp0.io', '.raw.icp0.io');
  }
  
  // Convert ic0.app to raw.ic0.app
  if (host.includes('ic0.app')) {
    return host.replace('ic0.app', 'raw.ic0.app');
  }
  
  // For custom domains or localhost, return as-is
  return host;
}

/**
 * Get the appropriate host based on fallback state
 */
export function getHostWithFallback(defaultHost: string): string {
  if (isFallbackActive()) {
    return convertToRawDomain(defaultHost);
  }
  return defaultHost;
}
