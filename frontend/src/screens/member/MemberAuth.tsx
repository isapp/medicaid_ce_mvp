import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getAPIClient } from '../../api/client';

export const MemberAuth: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Remove formatting to get raw phone number
      const rawPhone = phoneNumber.replace(/\D/g, '');

      await getAPIClient().post('/auth/member/request-code', {
        phoneNumber: rawPhone,
      });

      // Navigate to verify screen with phone number
      navigate('/m/auth/verify', { state: { phoneNumber: rawPhone } });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
              />
              <p className="form-help">
                We'll send you a verification code via SMS
              </p>
              {error && <p className="form-error" style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
            </div>

            <Button type="submit" variant="primary" disabled={phoneNumber.length < 12 || isLoading}>
              {isLoading ? 'Sending...' : 'Continue'}
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
