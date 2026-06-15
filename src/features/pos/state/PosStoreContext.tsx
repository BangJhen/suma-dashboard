// ─── POS Store Context ───────────────────────────────────────────────────────
// Provides shared store state to all POS components via React Context
// instead of each component creating its own independent state.

import React, { createContext, useContext } from 'react';
import { usePosStore } from './usePosStore';

type PosStore = ReturnType<typeof usePosStore>;

const PosStoreContext = createContext<PosStore | null>(null);

export function PosStoreProvider({ children }: { children: React.ReactNode }) {
  const store = usePosStore();
  return (
    <PosStoreContext.Provider value={store}>
      {children}
    </PosStoreContext.Provider>
  );
}

export function usePosStoreContext(): PosStore {
  const context = useContext(PosStoreContext);
  if (!context) {
    throw new Error('usePosStoreContext must be used within a <PosStoreProvider>');
  }
  return context;
}
