// AppShell.tsx
// Provides the top-level application shell and layout chrome. This component has no local authority.

import React from 'react';
import { VaultGuard } from './VaultGuard';

export function AppShell({ children }: { children?: React.ReactNode }) {
  return <VaultGuard>{children}</VaultGuard>;
}
