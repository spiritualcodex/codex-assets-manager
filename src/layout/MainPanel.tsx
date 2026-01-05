// MainPanel.tsx
// Hosts primary view content within the application shell. No local authority or layout state is stored here.

import React from 'react';

export function MainPanel({ children }: { children?: React.ReactNode }) {
  return <main className="main-panel">{children}</main>;
}
