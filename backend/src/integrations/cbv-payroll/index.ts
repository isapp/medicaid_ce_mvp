/**
 * CBV Payroll Integration
 *
 * Integration with iv-cbv-payroll service for employment verification
 * via payroll aggregators (Argyle, Pinwheel).
 */

export { CbvPayrollClient } from './client';
export { CbvPayrollService } from './service';

export type {
  CreateInvitationRequest,
  CreateInvitationResponse,
  CbvWebhookEvent
} from './client';

export type {
  VerificationStatusResponse
} from './service';
