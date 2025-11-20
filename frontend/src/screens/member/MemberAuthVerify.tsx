import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InputOTP } from '../../components/member/InputOTP';

export const MemberAuthVerify: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleComplete = async (value: string) => {
    setIsVerifying(true);
    
    setTimeout(() => {
      navigate('/m/dashboard');
    }, 1000);
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
