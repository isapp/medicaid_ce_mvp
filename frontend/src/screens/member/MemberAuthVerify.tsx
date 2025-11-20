import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InputOTP } from '../../components/member/InputOTP';
import { getAPIClient, APIError } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export const MemberAuthVerify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [code, setCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const demoCode = location.state?.demoCode;

  const handleComplete = async (value: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const phone = localStorage.getItem('member_phone');
      if (!phone) {
        setError('Phone number not found. Please start over.');
        setIsVerifying(false);
        return;
      }

      const apiClient = getAPIClient();
      const response = await apiClient.post<{
        accessToken: string;
        user: {
          id: string;
          tenantId: string;
          role: string;
          phone: string;
          name: string;
        };
      }>('/auth/member/verify-code', {
        phone,
        code: value,
      });

      login(response.accessToken, {
        id: response.user.id,
        tenantId: response.user.tenantId,
        role: 'member',
        phoneNumber: response.user.phone,
        name: response.user.name,
      });

      localStorage.removeItem('member_phone');
      navigate('/m/dashboard');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to verify code. Please try again.');
      }
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setCode('');
    setError(null);

    try {
      const phone = localStorage.getItem('member_phone');
      if (!phone) {
        setError('Phone number not found. Please start over.');
        return;
      }

      const apiClient = getAPIClient();
      await apiClient.post<{ message: string; demoCode?: string }>(
        '/auth/member/request-code',
        { phone }
      );

      setError(null);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    }
  };

  return (
    <ScreenLayout showBack title="Verify Phone">
      <div className="member-auth-verify-screen">
        <div className="member-auth-header">
          <h1>Enter Verification Code</h1>
          <p>We sent a 6-digit code to your phone</p>
          {demoCode && (
            <p style={{ color: 'green', fontWeight: 'bold', marginTop: '8px' }}>
              Demo Code: {demoCode}
            </p>
          )}
        </div>

        <Card className="member-auth-card">
          <div className="form-group">
            <label>Verification Code</label>
            <InputOTP
              length={6}
              value={code}
              onChange={setCode}
              onComplete={handleComplete}
              disabled={isVerifying}
            />
            {error && <p className="form-error" style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
          </div>

          <Button
            variant="secondary"
            onClick={handleResend}
            disabled={isVerifying}
          >
            Resend Code
          </Button>
        </Card>

        <div className="member-auth-footer">
          <p>
            Didn't receive a code? Check your phone number and try again.
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};
