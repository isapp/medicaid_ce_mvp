import React from 'react';
import { BeneficiaryList } from './components/features/beneficiaries/BeneficiaryList';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  return (
    <AppShell>
      <BeneficiaryList />
    </AppShell>
  );
};
