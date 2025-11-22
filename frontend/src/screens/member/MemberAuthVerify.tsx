import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InputOTP } from '../../components/member/InputOTP';
import { getAPIClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export const MemberAuthVerify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [code, setCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState('');

  const phoneNumber = (location.state as any)?.phoneNumber || '';

  React.useEffect(() => {
    if (!phoneNumber) {
      navigate('/m');
    }
  }, [phoneNumber, navigate]);

  const handleComplete = async (value: string) => {
    setIsVerifying(true);
    setError('');

    try {
      const response = await getAPIClient().post<{
        accessToken: string;
        user: {
          id: string;
          tenantId: string;
          role: string;
          phoneNumber: string;
          name: string;
        };
      }>('/auth/member/verify-code', {
        phoneNumber,
        code: value,
      });

      // Log the user in
      login(response.accessToken, response.user);

      // Navigate to member dashboard
      navigate('/m/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid verification code');
      setCode('');
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setCode('');
    console.log('Resending verification code...');
  };

  return (
    <ScreenLayout showBack title="Verify Phone">
      <div className="member-auth-verify-screen">
        <div className="member-auth-header">
          <h1>Enter Verification Code</h1>
          <p>We sent a 6-digit code to your phone</p>
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
