import React from 'react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>Medicaid Community Engagement</h1>
      </header>
      <main className="app-shell__main">{children}</main>
    </div>
  );
};
