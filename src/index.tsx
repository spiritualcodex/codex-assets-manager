// index.tsx
// Entry point for the Assets Manager frontend. Rendering is deferred until Vault-controlled bootstrapping occurs.

import React from 'react';
import { AppShell } from './app/AppShell';
import { Routes } from './app/Routes';

export function bootstrapApp() {
  return (
    <AppShell>
      <Routes />
    </AppShell>
  );
}
