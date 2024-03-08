import { writable, get } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

// Define a writable store for the provider token
export const providerTokenStore = writable<Session['provider_token'] | undefined>(undefined);

// Function to set the provider token
export function setProviderToken(token: Session['provider_token']) {
    providerTokenStore.set(token);
}

// Function to get the provider token
export function getProviderToken(): Session['provider_token'] | undefined {
    return get(providerTokenStore);
}
