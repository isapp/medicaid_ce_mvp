import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const MemberAuth: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/m/auth/verify');
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <ScreenLayout>
      <div className="member-auth-screen">
        <div className="member-auth-header">
          <h1>Welcome</h1>
          <p>Enter your phone number to get started</p>
        </div>

        <Card className="member-auth-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <Input
                id="phone"
                type="tel"
                placeholder="555-123-4567"
                value={phoneNumber}
                onChange={handlePhoneChange}
                autoComplete="tel"
                required
              />
              <p className="form-help">
                We'll send you a verification code via SMS
              </p>
            </div>

            <Button type="submit" variant="primary" disabled={phoneNumber.length < 12}>
              Continue
            </Button>
          </form>
        </Card>

        <div className="member-auth-footer">
          <p>
            By continuing, you agree to receive SMS messages for verification purposes.
            Standard message and data rates may apply.
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};
