# CBV (Consent-Based Verification) Integration Guide

## Overview

This guide explains the integration between `medicaid_ce_mvp` and the `iv-cbv-payroll` service for automated employment verification via payroll aggregators (Argyle, Pinwheel).

## Architecture

### Integration Pattern

We use a **Direct API Integration** pattern with the following components:

```
┌─────────────────────┐
│  medicaid_ce_mvp    │
│   (Frontend)        │
└──────────┬──────────┘
           │
           │ 1. Create Activity
           │ 2. Initiate Verification
           ▼
┌─────────────────────┐
│  medicaid_ce_mvp    │      3. Create Invitation      ┌──────────────────┐
│    (Backend)        │────────────────────────────────▶│ iv-cbv-payroll   │
│                     │◀───────────────────────────────│   (JSON API)     │
└──────────┬──────────┘      4. Return URL             └──────────────────┘
           │                                                     │
           │ 5. Display Verification Modal                      │
           │    (Iframe with CBV flow)                          │
           │                                                     │
           │ 7. Webhook: Verification Complete                  │
           │◀────────────────────────────────────────────────────┘
           │
           │ 8. Update Activity Status
           ▼
    ┌────────────┐
    │ PostgreSQL │
    └────────────┘
```

### User Flow

1. **Member** reports employment activity (employer name, hours, date)
2. **Backend** creates `EmploymentActivity` record in database
3. **Backend** calls iv-cbv-payroll API to create verification invitation
4. **Frontend** displays verification URL in iframe modal
5. **Member** completes payroll verification in embedded iframe
6. **iv-cbv-payroll** sends webhook when verification completes
7. **Backend** receives webhook and updates activity status
8. **Frontend** polls for status updates and closes modal

## Installation & Setup

### 1. Database Schema

The integration adds the `EmploymentActivity` model to track employment and verification:

```prisma
model EmploymentActivity {
  id                     String    @id @default(uuid())
  tenantId               String
  beneficiaryId          String
  employerName           String
  hoursWorked            Float
  activityDate           String
  verificationStatus     String    @default("pending")
  verificationMethod     String?
  provider               String?

  // CBV Integration fields
  externalVerificationId String?
  verificationUrl        String?
  verificationData       Json?
  webhookReceivedAt      DateTime?

  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  tenant      Tenant      @relation(fields: [tenantId], references: [id])
  beneficiary Beneficiary @relation(fields: [beneficiaryId], references: [id])

  @@index([tenantId])
  @@index([beneficiaryId])
  @@index([tenantId, verificationStatus])
}
```

**Migration applied:** `20251122202305_add_employment_activity`

### 2. Environment Variables

Add the following to `backend/.env`:

```bash
# CBV (Consent-Based Verification) Payroll Integration
CBV_API_URL="https://cbv-sandbox.example.com"
CBV_API_KEY="your-api-key-here"
CBV_HMAC_SECRET="your-hmac-secret-here"
```

**How to obtain credentials:**

1. Contact the iv-cbv-payroll team to create a service account
2. Request API token and HMAC secret for your tenant
3. Use sandbox environment for development/testing
4. Switch to production URL for live deployment

### 3. Backend Components

#### Integration Service

- **Location:** `backend/src/integrations/cbv-payroll/`
- **Client:** `client.ts` - HTTP client with HMAC signature verification
- **Service:** `service.ts` - Business logic for verification flow
- **Index:** `index.ts` - Public exports

#### API Endpoints

**Engagement Routes** (`backend/src/modules/engagement/engagement.routes.ts`):

```typescript
POST   /api/v1/engagements/beneficiaries/:beneficiaryId/activities
POST   /api/v1/engagements/activities/:activityId/verify
GET    /api/v1/engagements/activities/:activityId/verification-status
```

**Webhook Routes** (`backend/src/routes/webhooks.ts`):

```typescript
POST   /api/v1/webhooks/employment-verification
GET    /api/v1/webhooks/health
```

### 4. Frontend Components

#### VerificationModal Component

- **Location:** `frontend/src/components/member/VerificationModal.tsx`
- **Purpose:** Embeds iv-cbv-payroll verification flow in iframe
- **Features:**
  - Full-screen modal with iframe
  - Loading states and error handling
  - PostMessage communication for completion events
  - Auto-close on verification complete

#### API Client

- **Location:** `frontend/src/api/employment-verification.ts`
- **Functions:**
  - `createEmploymentActivity()` - Create new activity
  - `initiateVerification()` - Start verification flow
  - `getVerificationStatus()` - Check verification status
  - `pollVerificationStatus()` - Poll for status updates

#### Member Employment Screen

- **Location:** `frontend/src/screens/member/MemberEmployment.tsx`
- **Features:**
  - Form to add employment activities
  - Activity list with verification status badges
  - "Verify Employment" button
  - Automatic verification on activity creation

## API Reference

### Create Employment Activity

```http
POST /api/v1/engagements/beneficiaries/:beneficiaryId/activities
Authorization: Bearer {token}
Content-Type: application/json

{
  "employer_name": "Acme Corp",
  "hours_worked": 40,
  "activity_date": "2025-01-15"
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "beneficiary_id": "uuid",
    "employer_name": "Acme Corp",
    "hours_worked": 40,
    "activity_date": "2025-01-15",
    "verification_status": "pending",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "error": null
}
```

### Initiate Verification

```http
POST /api/v1/engagements/activities/:activityId/verify
Authorization: Bearer {token}
```

**Response:**

```json
{
  "data": {
    "verification_url": "https://cbv.cms.gov/start/abc123def456",
    "expires_at": "2025-12-31T23:59:59Z"
  },
  "error": null
}
```

### Webhook Event

```http
POST /api/v1/webhooks/employment-verification
X-IVAAS-SIGNATURE: {hmac-sha512-signature}
X-IVAAS-TIMESTAMP: {unix-timestamp}
Content-Type: application/json

{
  "event_type": "verification_completed",
  "cbv_flow_id": "123",
  "status": "verified",
  "metadata": {
    "case_number": "activity-uuid",
    "employers": [
      {
        "name": "Acme Corp",
        "income": 3200.00,
        "period": "monthly",
        "verification_date": "2025-01-15"
      }
    ]
  },
  "created_at": "2025-01-15T10:30:00Z"
}
```

## Security

### Webhook Signature Verification

All webhooks are verified using HMAC-SHA512 signatures:

```typescript
const signature = req.headers['x-ivaas-signature'];
const timestamp = req.headers['x-ivaas-timestamp'];
const payload = JSON.stringify(req.body);

const isValid = cbvService.verifyWebhookSignature(
  payload,
  signature,
  timestamp
);
```

### Replay Attack Prevention

- Webhook timestamps are validated (max age: 5 minutes)
- Timing-safe comparison prevents timing attacks
- Invalid signatures are logged for security monitoring

### Iframe Security

The VerificationModal uses sandboxed iframes:

```html
<iframe
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
  allow="camera; microphone; geolocation"
/>
```

## Testing

### Local Development

1. **Start medicaid_ce_mvp:**

```bash
cd /Users/jayson/medicaid_ce_mvp
docker-compose up -d
```

2. **Configure CBV credentials** in `backend/.env`:

```bash
CBV_API_URL="https://cbv-sandbox.example.com"
CBV_API_KEY="sandbox-key"
CBV_HMAC_SECRET="sandbox-secret"
```

3. **Test webhook endpoint:**

```bash
curl -X POST http://localhost:4000/api/v1/webhooks/employment-verification \
  -H "Content-Type: application/json" \
  -H "X-IVAAS-SIGNATURE: test-signature" \
  -H "X-IVAAS-TIMESTAMP: $(date +%s)" \
  -d '{
    "event_type": "verification_completed",
    "cbv_flow_id": "test-123",
    "status": "verified",
    "metadata": {
      "case_number": "test-activity-id",
      "employers": []
    },
    "created_at": "2025-01-15T10:00:00Z"
  }'
```

### Integration Testing with iv-cbv-payroll Sandbox

1. **Get sandbox credentials** from iv-cbv-payroll team
2. **Create test activity** via API or UI
3. **Initiate verification** - should return sandbox URL
4. **Complete sandbox flow** using test payroll credentials
5. **Verify webhook received** - check logs and database
6. **Confirm status updated** - activity should be "verified"

## Monitoring & Debugging

### Logging

All CBV operations are logged:

```typescript
console.info('CBV webhook processed successfully', {
  activityId,
  eventType: event_type,
  status
});

console.error('CBV Payroll API Error:', {
  status,
  message,
  url,
  method
});
```

### Database Queries

Check verification status:

```sql
SELECT
  id,
  employer_name,
  verification_status,
  provider,
  webhook_received_at,
  verification_data
FROM "EmploymentActivity"
WHERE verification_status = 'verified'
ORDER BY webhook_received_at DESC;
```

### Health Checks

```bash
# API health
curl http://localhost:4000/api/v1/health

# Webhook receiver health
curl http://localhost:4000/api/v1/webhooks/health
```

## Troubleshooting

### Verification Modal Not Opening

**Problem:** Modal doesn't open after clicking "Verify"

**Solutions:**
1. Check browser console for errors
2. Verify `CBV_API_URL` is set in backend `.env`
3. Confirm API endpoint returns `verification_url`
4. Check network tab for failed API calls

### Webhook Not Received

**Problem:** Verification completes but status doesn't update

**Solutions:**
1. Check webhook endpoint is publicly accessible
2. Verify HMAC secret matches iv-cbv-payroll config
3. Check backend logs for webhook errors
4. Confirm webhook URL is registered with iv-cbv-payroll

### Signature Verification Failed

**Problem:** Webhooks rejected with 401 error

**Solutions:**
1. Verify `CBV_HMAC_SECRET` matches iv-cbv-payroll config
2. Check system time is synchronized (NTP)
3. Ensure payload is not modified between reception and verification
4. Test with iv-cbv-payroll test webhook tool

## Production Deployment

### Pre-Deployment Checklist

- [ ] Database migration applied successfully
- [ ] Production CBV credentials obtained and configured
- [ ] Webhook endpoint accessible from iv-cbv-payroll servers
- [ ] SSL/TLS certificate valid and configured
- [ ] CORS origins include production frontend URL
- [ ] Logging and monitoring configured
- [ ] Error alerting set up for failed verifications
- [ ] Backup and rollback plan documented

### Production Environment Variables

```bash
# Production
CBV_API_URL="https://cbv.cms.gov"
CBV_API_KEY="prod-api-key-from-1password"
CBV_HMAC_SECRET="prod-hmac-secret-from-1password"
```

### Webhook URL Registration

Register webhook URL with iv-cbv-payroll:

```
https://your-domain.com/api/v1/webhooks/employment-verification
```

## Support & Resources

### Documentation

- **iv-cbv-payroll README:** `/Users/jayson/SourceCode/iv-cbv-payroll/README.md`
- **API Integration Guide:** `/Users/jayson/SourceCode/iv-cbv-payroll/docs/`
- **medicaid_ce_mvp Architecture:** `/Users/jayson/medicaid_ce_mvp/docs/architecture.md`
- **Figma Design Compliance:** `/Users/jayson/medicaid_ce_mvp/docs/CBV_FIGMA_COMPLIANCE.md`
- **Design System Guidelines:** `/Users/jayson/medicaid_ce_mvp/docs/figma-analysis/design-system-guidelines.md`

### Contact

- **iv-cbv-payroll Team:** ffs@nava.pbc.com
- **Technical Issues:** File issue on GitHub
- **Security Issues:** Use HHS responsible disclosure portal

## Future Enhancements

### Planned Features

1. **Real-time status updates** via WebSocket instead of polling
2. **Bulk verification** for multiple activities at once
3. **Verification history** showing all verification attempts
4. **Admin override** to manually verify activities
5. **Verification reminders** via SMS/email
6. **Analytics dashboard** for verification success rates

### Potential Integrations

- **Bank account verification** as alternative to payroll
- **Gig economy platform** integrations (Uber, DoorDash, etc.)
- **Education verification** using similar pattern
- **State eligibility systems** for automated case updates

## Changelog

### v1.0.0 (2025-01-22)

- Initial integration with iv-cbv-payroll
- Database schema for EmploymentActivity
- Backend API endpoints and webhook handler
- Frontend VerificationModal component
- Member employment screen with verification flow
- Comprehensive documentation
