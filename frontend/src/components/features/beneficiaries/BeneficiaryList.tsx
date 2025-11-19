import React, { useEffect, useState } from 'react';
import { Card } from '../../ui/Card';

type Beneficiary = {
  id: string;
  first_name?: string;
  last_name?: string;
  engagement_status?: string;
};

export const BeneficiaryList: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/v1/beneficiaries');
      const json = await res.json();
      setBeneficiaries(json.data.items || []);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Beneficiaries</h2>
      {beneficiaries.length === 0 && <p>No beneficiaries found.</p>}
      <div className="beneficiaries-grid">
        {beneficiaries.map((b) => (
          <Card key={b.id}>
            <h3>
              {b.first_name || 'First'} {b.last_name || 'Last'}
            </h3>
            <p>Status: {b.engagement_status || 'unknown'}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
