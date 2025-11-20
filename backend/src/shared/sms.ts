import { logInfo } from './logging';
import { config } from './config';

export interface SMSProvider {
  sendSMS(to: string, message: string): Promise<void>;
}

/**
 * Demo SMS provider that logs messages instead of sending them
 * Returns the OTP code in demo mode for easy testing
 */
class DemoSMSProvider implements SMSProvider {
  async sendSMS(to: string, message: string): Promise<void> {
    logInfo(`[DEMO SMS] To: ${to}, Message: ${message}`);
  }
}

/**
 * Twilio SMS provider (stub for future implementation)
 */
class TwilioSMSProvider implements SMSProvider {
  async sendSMS(to: string, message: string): Promise<void> {
    throw new Error('Twilio SMS provider not implemented yet');
  }
}

/**
 * Get the configured SMS provider
 */
export function getSMSProvider(): SMSProvider {
  return new DemoSMSProvider();
}
