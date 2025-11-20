# Resolved Decisions

This document contains the answers to all 20 open questions from the issues-decisions.md document, provided on November 20, 2025.

## Resolved Questions

### Authentication & Authorization

#### Q1: Admin Authentication Method ✅ RESOLVED

**Decision**: Email/password with local authentication + demo bypass flag

**Implementation Details**:
- Standard email/password authentication for admin users
- Add `DEMO_MODE` environment variable to bypass authentication
- When `DEMO_MODE=true`, allow login without credential validation
- Demo mode should only be enabled in development/staging environments

**Impact on Implementation**:
- Update auth-flows.md to document demo mode
- Add demo mode flag to environment variables
- Implement demo bypass in backend authentication middleware
- Add warning banner when demo mode is active

---

#### Q2: Token Refresh Strategy ✅ RESOLVED

**Decision**: Sliding session (extend on activity)

**Implementation Details**:
- Session extends automatically on user activity
- 30-minute timeout from last activity (see Q3)
- No separate refresh token needed
- Access token is refreshed on each API call if within refresh window

**Impact on Implementation**:
- Simpler implementation than refresh token pattern
- Update auth-flows.md to reflect sliding session
- Backend tracks last activity timestamp
- Frontend doesn't need refresh token logic

---

#### Q3: Session Timeout Duration ✅ RESOLVED

**Decision**: 30 minutes for both admin and member users

**Implementation Details**:
- Admin users: 30-minute sliding session
- Member users: 30-minute sliding session
- Consistent timeout across both user types
- Session extends on activity (see Q2)

**Impact on Implementation**:
- Update auth-flows.md with 30-minute timeout
- Implement session timeout tracking in AuthContext
- Show warning before session expires (optional)
- Redirect to login on session expiry

---

### API & Backend Integration

#### Q4: API Base URL Configuration ✅ RESOLVED

**Decision**: Environment variables as documented

**Implementation Details**:
- Use `VITE_API_BASE_URL` for frontend
- Standard environment variable approach
- No runtime configuration file needed

**Impact on Implementation**:
- No changes needed - already documented correctly
- Confirm in deployment documentation

---

#### Q5: File Upload Size Limits ✅ RESOLVED

**Decision**: 25 MB per file, configurable via environment variable

**Implementation Details**:
- Maximum file size: 25 MB
- Add `MAX_UPLOAD_SIZE_MB` environment variable
- Default to 25 MB if not specified
- Validate on both frontend and backend

**Impact on Implementation**:
- Update api-integration.md with file size limits
- Add validation to file upload components
- Add environment variable to documentation
- Display file size limit in UI

---

#### Q6: Webhook Security ✅ RESOLVED

**Decision**: API key authentication

**Implementation Details**:
- Webhooks secured with API key in header
- Each integration partner gets unique API key
- API keys stored securely in backend
- Validate API key on all webhook requests

**Impact on Implementation**:
- Update api-integration.md with API key authentication
- Backend generates and manages API keys
- Document API key format for integration partners
- Add API key validation middleware

---

### Employment Verification

#### Q7: Gig Platform Integration Partners ✅ RESOLVED

**Decision**: NO gig platforms in Phase 1

**Implementation Details**:
- Remove all gig platform integrations from Phase 1
- Remove Uber, Lyft, DoorDash, Instacart from Phase 1 scope
- Gig platform path can be added in future phases
- Focus on Argyle (payroll) and manual upload for Phase 1

**Impact on Implementation**:
- **MAJOR SCOPE CHANGE**: Remove gig platform screens from Phase 3
- Update navigation.md to remove gig routes
- Update component-io.md to remove gig components
- Update employment flow to remove gig path option
- Simplify employment verification to: Traditional (Argyle), Bank, Manual
- Update member dashboard to reflect available paths

---

#### Q8: Payroll Integration Partners ✅ RESOLVED

**Decision**: Argyle will be implemented in Phase 1

**Implementation Details**:
- Integrate with Argyle for payroll verification
- Argyle provides access to 140+ payroll providers
- OAuth flow for user authentication
- Webhook for verification status updates

**Impact on Implementation**:
- Confirm Argyle integration in api-integration.md
- Document Argyle OAuth flow in auth-flows.md
- Implement Argyle SDK integration
- Add Argyle webhook endpoint
- Test with Argyle sandbox environment

---

#### Q9: Manual Verification Processing Time ✅ RESOLVED

**Decision**: Disregard this question

**Implementation Details**:
- No specific processing time requirement
- Display generic "under review" message
- Backend team determines actual processing time

**Impact on Implementation**:
- Use generic messaging in success screens
- No specific SLA to display to users

---

### Education Verification

#### Q10: Education Verification Method ✅ RESOLVED

**Decision**: National Student Clearinghouse

**Implementation Details**:
- Integrate with National Student Clearinghouse (NSC)
- NSC provides enrollment verification for 3,600+ institutions
- API integration for automated verification
- Fallback to manual document upload if NSC unavailable

**Impact on Implementation**:
- Confirm NSC integration in api-integration.md
- Document NSC API integration
- Implement NSC API client
- Add NSC webhook endpoint (if available)
- Test with NSC sandbox/test environment

---

### Exemptions

#### Q11: Exemption Approval Workflow ✅ RESOLVED

**Decision**: Automatic approval based on criteria

**Implementation Details**:
- Exemptions approved automatically if criteria met
- No manual case worker review required
- Backend validates exemption criteria
- Instant approval/denial response to member

**Impact on Implementation**:
- Update exemption flow to show immediate approval
- Remove "pending review" status for exemptions
- Backend implements approval criteria logic
- Update admin view to show auto-approved exemptions
- Add audit trail for automatic approvals

---

#### Q12: Exemption Duration Limits ✅ RESOLVED

**Decision**: Don't enforce any durations at this time

**Implementation Details**:
- No maximum duration limits enforced
- Users can specify any start/end dates
- Backend accepts user-specified dates without validation
- Future phases may add duration limits

**Impact on Implementation**:
- No validation changes needed
- Document that duration limits may be added later
- Allow flexible date ranges in exemption forms

---

### Notifications & Messaging

#### Q13: SMS Provider ✅ RESOLVED

**Decision**: Twilio

**Implementation Details**:
- Use Twilio for SMS authentication codes
- Use Twilio for notification messages
- Twilio account required for production
- Use Twilio test credentials for development

**Impact on Implementation**:
- Confirm Twilio in api-integration.md
- Add Twilio credentials to environment variables
- Implement Twilio SDK integration
- Test SMS delivery in staging environment
- Document Twilio setup in deployment guide

---

#### Q14: Notification Preferences ✅ RESOLVED

**Decision**: All notifications required (compliance)

**Implementation Details**:
- Members cannot opt out of notifications
- All notifications are compliance-related
- No notification preferences UI needed
- Notifications are mandatory for program participation

**Impact on Implementation**:
- Remove notification preferences from settings
- Simplify settings UI (no opt-out toggles)
- Document that notifications are mandatory
- Update member settings screens

---

### Multi-Tenancy

#### Q15: Tenant Onboarding Process ✅ RESOLVED

**Decision**: Manual setup by engineering

**Implementation Details**:
- New tenants onboarded manually by engineering team
- No self-service tenant creation
- Engineering creates tenant records in database
- Engineering configures tenant settings

**Impact on Implementation**:
- No tenant onboarding UI needed in Phase 1
- Document manual tenant setup process
- Create tenant setup scripts/procedures
- Future phases may add admin portal for tenant management

---

#### Q16: Tenant Customization ✅ RESOLVED

**Decision**: Custom workflows

**Implementation Details**:
- Tenants can have custom workflows
- Beyond just feature toggles and branding
- Workflow customization details TBD
- May require tenant-specific configuration

**Impact on Implementation**:
- Design for workflow flexibility
- Consider tenant-specific workflow configuration
- May need workflow engine or rules engine
- Document customization capabilities
- Plan for tenant-specific workflow variations

---

### Data & Privacy

#### Q17: Data Retention Policy ✅ RESOLVED

**Decision**: Configurable per tenant

**Implementation Details**:
- Each tenant can specify their own retention policy
- Add retention policy to tenant settings
- Backend implements data archival/deletion based on policy
- Default retention policy TBD

**Impact on Implementation**:
- Add retention policy to tenant settings UI
- Backend implements retention policy enforcement
- Add data archival/deletion jobs
- Document retention policy options
- Ensure compliance with state regulations

---

#### Q18: PII Handling ✅ RESOLVED

**Decision**: HIPAA compliance requirements

**Implementation Details**:
- Full HIPAA compliance required
- Encryption at rest and in transit
- Access logging and audit trails
- Business Associate Agreements (BAAs) with vendors
- Regular security audits

**Impact on Implementation**:
- **CRITICAL**: HIPAA compliance affects entire architecture
- Implement comprehensive audit logging
- Encrypt sensitive fields in database
- Ensure all third-party vendors are HIPAA compliant
- Document HIPAA compliance measures
- Security audit before production launch
- Staff HIPAA training required

---

### Reporting & Analytics

#### Q19: Reporting Data Warehouse ✅ RESOLVED

**Decision**: Separate warehouse

**Implementation Details**:
- Separate analytics database for reporting
- ETL pipeline from production to warehouse
- Reporting queries don't impact production performance
- Data warehouse optimized for analytics

**Impact on Implementation**:
- Set up separate analytics database
- Implement ETL pipeline (nightly batch or real-time)
- Update reporting endpoints to query warehouse
- Document data warehouse schema
- Plan for data warehouse maintenance

---

#### Q20: Export Formats ✅ RESOLVED

**Decision**: CSV and PDF

**Implementation Details**:
- Reports can be exported as CSV
- Reports can be exported as PDF
- No Excel format in Phase 1
- Export functionality on all report screens

**Impact on Implementation**:
- Implement CSV export (server-side)
- Implement PDF export (server-side, use library like Puppeteer or PDFKit)
- Add export buttons to reporting UI
- Handle large exports (async generation + download link)
- Document export limitations (row limits, etc.)

---

## Summary of Major Changes

### Phase 1 Scope Changes

**REMOVED from Phase 1**:
- ❌ Gig platform integrations (Uber, Lyft, DoorDash, Instacart)
- ❌ Gig platform selection screens
- ❌ Gig platform OAuth flows
- ❌ Notification preferences UI (all notifications required)
- ❌ Tenant onboarding UI (manual setup)

**CONFIRMED for Phase 1**:
- ✅ Argyle integration (payroll verification)
- ✅ National Student Clearinghouse (education verification)
- ✅ Twilio (SMS provider)
- ✅ Manual document upload (employment verification)
- ✅ Bank verification (employment verification)
- ✅ Automatic exemption approval

**NEW Requirements**:
- ✅ Demo mode bypass for authentication
- ✅ HIPAA compliance (affects entire architecture)
- ✅ Separate data warehouse for reporting
- ✅ Custom workflow support per tenant
- ✅ Configurable data retention per tenant

### Implementation Priority Changes

**High Priority**:
1. HIPAA compliance implementation (audit logging, encryption, BAAs)
2. Argyle integration for payroll verification
3. National Student Clearinghouse integration
4. Twilio SMS integration
5. Automatic exemption approval logic
6. Demo mode authentication bypass

**Medium Priority**:
1. Separate data warehouse setup
2. CSV/PDF export functionality
3. Tenant-specific retention policies
4. Custom workflow framework

**Deferred to Future Phases**:
1. Gig platform integrations
2. Tenant self-service onboarding
3. Excel export format
4. Notification preferences

---

## Updated Environment Variables

Add these environment variables to deployment documentation:

**Frontend**:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_DEMO_MODE=false
```

**Backend**:
```
# Authentication
DEMO_MODE=false
SESSION_TIMEOUT_MINUTES=30

# File Upload
MAX_UPLOAD_SIZE_MB=25

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567

# Argyle
ARGYLE_CLIENT_ID=your_client_id
ARGYLE_CLIENT_SECRET=your_client_secret
ARGYLE_WEBHOOK_SECRET=your_webhook_secret

# National Student Clearinghouse
NSC_API_KEY=your_api_key
NSC_API_SECRET=your_api_secret

# Data Warehouse
WAREHOUSE_DATABASE_URL=postgresql://...
```

---

## Next Steps

1. ✅ Update issues-decisions.md to mark all questions as resolved
2. ⏳ Update auth-flows.md with demo mode and sliding session
3. ⏳ Update api-integration.md to remove gig platforms, add file size limits
4. ⏳ Update navigation.md to remove gig platform routes
5. ⏳ Update component-io.md to remove gig platform components
6. ⏳ Update mobile-accessibility.md with HIPAA considerations
7. ⏳ Create HIPAA compliance checklist document
8. ⏳ Update Phase 3 roadmap to reflect scope changes
9. ⏳ Document all new environment variables
10. ⏳ Create data warehouse architecture document

---

## Risk Assessment Updates

**New High-Risk Items**:
- **HIPAA Compliance**: Comprehensive compliance required, affects entire architecture, requires security audit
- **Custom Workflows**: Complexity of tenant-specific workflow customization TBD

**Reduced Risk Items**:
- **Gig Platform Integration**: Removed from Phase 1, reduces integration complexity
- **Session Management**: Sliding session simpler than refresh token pattern

**New Dependencies**:
- Argyle partnership and integration
- National Student Clearinghouse API access
- Twilio account and SMS delivery
- Data warehouse infrastructure
- HIPAA compliance audit and certification
