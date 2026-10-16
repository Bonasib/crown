'use client';

import { useSyncExternalStore } from 'react';
import type { JobStatus, MediaKind } from './providers/types';

/**
 * Client-side persistence for the library and credit balance. Accounts and a
 * server-side ledger are on the roadmap; until then everything lives in
 * localStorage so the product is fully usable without a database.
 */

export interface LibraryItem {
  id: string;
  jobId: string;
  kind: MediaKind;
  modelId: string;
  prompt: string;
  aspectRatio?: string;
  presetSlug?: string;
  appSlug?: string;
  status: JobStatus;
  outputs: string[];
  error?: string;
  credits: number;
  createdAt: number;
  favorite?: boolean;
}

interface State {
  library: LibraryItem[];
  credits: number;
  plan: string;
}

const KEY = 'wilo:v1';
const DEFAULT: State = { library: [], credits: 150, plan: 'free' };
const listeners = new Set<() => void>();
let state: State = DEFAULT;
let loaded = false;

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...(JSON.parse(raw) as Partial<State>) };
  } catch {
    // Private mode or corrupted storage: start fresh.
  }
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...state, library: state.library.slice(0, 300) }));
  } catch {
    // Quota exceeded: keep working in memory.
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  save();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  load();
  return state;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()), () => selector(DEFAULT));
}

export function getLibrary() {
  return getSnapshot().library;
}

export const actions = {
  add(item: LibraryItem) {
    set({ library: [item, ...state.library] });
  },
  update(id: string, patch: Partial<LibraryItem>) {
    set({ library: state.library.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  },
  remove(id: string) {
    set({ library: state.library.filter((i) => i.id !== id) });
  },
  toggleFavorite(id: string) {
    set({ library: state.library.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)) });
  },
  spend(amount: number) {
    if (state.credits < amount) return false;
    set({ credits: state.credits - amount });
    return true;
  },
  refund(amount: number) {
    set({ credits: state.credits + amount });
  },
  setPlan(plan: string, credits: number) {
    set({ plan, credits: state.credits + credits });
  },
  addCredits(amount: number) {
    set({ credits: state.credits + amount });
  },
};
