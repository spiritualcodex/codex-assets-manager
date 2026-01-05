// VaultGuard.tsx
// Wraps application content behind Vault session validation. This component does not make permission decisions client-side.

import React, { useEffect, useState } from 'react';
import { createVaultClient } from '../api/vaultClient';

type VaultGuardProps = {
  children?: React.ReactNode;
  sessionToken?: string;
};

const vaultClient = createVaultClient();

export function VaultGuard({ children, sessionToken }: VaultGuardProps) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const validate = async () => {
      try {
        await vaultClient.assertSession(sessionToken);
        if (!cancelled) {
          setIsAllowed(true);
        }
      } catch (error) {
        console.error('Vault session assertion failed', error);
        if (!cancelled) {
          setIsAllowed(false);
        }
      }
    };

    validate();

    return () => {
      cancelled = true;
    };
  }, [sessionToken]);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
