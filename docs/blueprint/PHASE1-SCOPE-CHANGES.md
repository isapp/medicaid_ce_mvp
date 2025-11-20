# Phase 1 Scope Changes

Based on the resolved decisions, this document summarizes the major changes to Phase 1 implementation scope.

## Major Scope Reductions

### ❌ REMOVED: Gig Platform Integrations

**What's Removed**:
- Uber integration
- Lyft integration
- DoorDash integration
- Instacart integration
- Gig platform selection screen
- Gig platform OAuth flows
- Gig platform login screens
- Gig platform verification screens

**Impact**:
- Significantly reduces Phase 3 complexity
- Eliminates 4 vendor integrations
- Removes ~15 member screens from implementation
- Reduces integration testing requirements
- Lowers vendor negotiation and cost burden

**Employment Verification Paths in Phase 1**:
1. ✅ **Traditional Employment** (via Argyle) - Payroll provider integration
2. ✅ **Bank Verification** - Bank account integration
3. ✅ **Manual Upload** - Paystub photo upload

**Member Flow Changes**:
- `/m/work/choose-path` now shows 3 options instead of 4
- Remove `/m/work/gig/*` routes entirely
- Update `SelectPathScreen` to remove gig option
- Update employment store to remove gig path

---

### ❌ REMOVED: Notification Preferences UI

**What's Removed**:
- Notification preferences settings screen
- Opt-out toggles for different notification types
- Notification frequency settings

**Rationale**: All notifications are compliance-required, no opt-out allowed

**Impact**:
- Simplifies member settings screens
- Reduces settings implementation complexity
- Clearer compliance messaging

---

### ❌ REMOVED: Tenant Onboarding UI

**What's Removed**:
- Admin portal for tenant creation
- Self-service tenant signup
- Tenant configuration wizard

**Rationale**: Manual setup by engineering team for Phase 1

**Impact**:
- No tenant management UI needed in Phase 1
- Engineering creates tenant setup scripts
- Future phases may add admin portal

---

## Major Additions

### ✅ ADDED: Demo Mode Authentication Bypass

**What's Added**:
- `DEMO_MODE` environment variable (backend)
- `VITE_DEMO_MODE` environment variable (frontend)
- Demo mode authentication bypass logic
- Demo mode warning banner
- Demo mode logging

**Purpose**: Enable development and testing without authentication

**Implementation**:
- Backend bypasses credential validation when `DEMO_MODE=true`
- Frontend displays warning banner when demo mode active
- Demo user automatically logged in
- MUST be disabled in production

**Files Affected**:
- `auth-flows.md` - Updated with demo mode documentation
- Backend auth middleware
- Frontend AuthContext
- Environment variable documentation

---

### ✅ ADDED: HIPAA Compliance Requirements

**What's Added**:
- Comprehensive audit logging
- Field-level encryption for sensitive data
- Access control logging
- Business Associate Agreements (BAAs) with vendors
- Security audit requirements
- HIPAA training requirements

**Impact**: **CRITICAL - Affects entire architecture**

**Implementation Requirements**:
1. **Audit Logging**:
   - Log all data access (who, what, when)
   - Log all data modifications
   - Log authentication events
   - Log failed access attempts
   - Tamper-proof audit logs

2. **Encryption**:
   - Encryption at rest (database)
   - Encryption in transit (HTTPS)
   - Field-level encryption for SSN, Medicaid ID
   - Secure key management

3. **Access Controls**:
   - Role-based access control (RBAC)
   - Minimum necessary access principle
   - Session timeout enforcement
   - Strong password requirements

4. **Vendor Compliance**:
   - Argyle: Verify HIPAA compliance, sign BAA
   - National Student Clearinghouse: Verify HIPAA compliance, sign BAA
   - Twilio: Verify HIPAA compliance, sign BAA
   - AWS/Cloud Provider: Sign BAA

5. **Documentation**:
   - HIPAA policies and procedures
   - Security incident response plan
   - Breach notification procedures
   - Privacy practices documentation

**Files Affected**:
- All blueprint documents (security considerations)
- New: `HIPAA-COMPLIANCE-CHECKLIST.md` (to be created)

---

### ✅ ADDED: Separate Data Warehouse

**What's Added**:
- Separate PostgreSQL database for analytics
- ETL pipeline from production to warehouse
- Reporting queries run against warehouse
- Data warehouse schema optimization

**Purpose**: Isolate reporting queries from production database

**Implementation**:
1. **Infrastructure**:
   - Provision separate database instance
   - Set up read replicas if needed
   - Configure backup and recovery

2. **ETL Pipeline**:
   - Nightly batch ETL (or real-time streaming)
   - Data transformation and aggregation
   - Historical data retention
   - Data quality checks

3. **Reporting**:
   - Update reporting endpoints to query warehouse
   - Optimize warehouse schema for analytics
   - Add indexes for common queries
   - Implement caching for expensive queries

**Files Affected**:
- `api-integration.md` - Reporting endpoints
- Infrastructure documentation
- DevOps setup guide

---

### ✅ ADDED: Custom Workflow Support

**What's Added**:
- Tenant-specific workflow customization
- Workflow configuration per tenant
- Flexible workflow engine

**Impact**: Increases architectural complexity

**Implementation Considerations**:
- Design workflow configuration schema
- Implement workflow engine or rules engine
- Allow tenant-specific workflow overrides
- Document workflow customization capabilities
- Plan for workflow versioning

**Status**: Details TBD, requires further design

---

## Confirmed Integrations for Phase 1

### ✅ Argyle (Payroll Verification)

**What**: Payroll provider integration for employment verification

**Implementation**:
- OAuth flow for user authentication
- Access to 140+ payroll providers
- Webhook for verification status updates
- Argyle SDK integration

**Requirements**:
- Argyle account and API credentials
- HIPAA compliance verification
- Business Associate Agreement (BAA)
- Sandbox testing environment

**Files Affected**:
- `api-integration.md` - Argyle endpoints
- `auth-flows.md` - Argyle OAuth flow
- Employment verification screens

---

### ✅ National Student Clearinghouse (Education Verification)

**What**: Education enrollment verification

**Implementation**:
- NSC API integration
- Access to 3,600+ institutions
- Automated enrollment verification
- Fallback to manual upload

**Requirements**:
- NSC account and API credentials
- HIPAA compliance verification
- Business Associate Agreement (BAA)
- Test environment access

**Files Affected**:
- `api-integration.md` - NSC endpoints
- Education verification screens

---

### ✅ Twilio (SMS Provider)

**What**: SMS delivery for authentication codes and notifications

**Implementation**:
- Twilio SDK integration
- SMS authentication codes (6-digit)
- Notification messages
- Delivery status webhooks

**Requirements**:
- Twilio account and credentials
- HIPAA compliance verification
- Business Associate Agreement (BAA)
- Phone number provisioning

**Files Affected**:
- `api-integration.md` - Twilio integration
- `auth-flows.md` - SMS authentication
- Member authentication screens

---

## Configuration Changes

### Environment Variables

**New Variables**:

**Frontend**:
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_DEMO_MODE=false  # NEW: Demo mode flag
```

**Backend**:
```bash
# Authentication
DEMO_MODE=false  # NEW: Demo mode bypass
SESSION_TIMEOUT_MINUTES=30  # CONFIRMED: 30 minutes

# File Upload
MAX_UPLOAD_SIZE_MB=25  # NEW: 25 MB limit

# Twilio (CONFIRMED)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567

# Argyle (CONFIRMED)
ARGYLE_CLIENT_ID=your_client_id
ARGYLE_CLIENT_SECRET=your_client_secret
ARGYLE_WEBHOOK_SECRET=your_webhook_secret

# National Student Clearinghouse (CONFIRMED)
NSC_API_KEY=your_api_key
NSC_API_SECRET=your_api_secret

# Data Warehouse (NEW)
WAREHOUSE_DATABASE_URL=postgresql://...
```

---

## Updated Implementation Phases

### Phase 1: Foundation (Weeks 1-2) - NO CHANGES

**Deliverables**:
- Theme system
- Routing infrastructure
- API client
- Auth context
- Shared UI primitives
- React Query setup
- Zustand stores

---

### Phase 2: Admin Experience (Weeks 3-5) - NO CHANGES

**Deliverables**:
- AdminShell layout
- Participant management
- Case management
- Broadcast messaging
- Reporting dashboard
- Settings
- DataTable component

---

### Phase 3: Member Experience (Weeks 6-10) - MAJOR CHANGES

**REMOVED**:
- ❌ Gig platform path (~15 screens)
- ❌ Gig platform selection
- ❌ Gig platform OAuth flows
- ❌ Notification preferences

**UPDATED**:
- Employment verification: 3 paths instead of 4 (Traditional/Bank/Manual)
- Settings: Simplified (no notification preferences)
- Exemptions: Automatic approval (no pending state)

**ADDED**:
- Demo mode support
- HIPAA audit logging
- Enhanced security measures

**Deliverables** (Updated):
1. ScreenLayout with mobile header, safe areas, bottom actions
2. Authentication flow (phone, SMS code, identity verification)
3. Assessment flow (8 screens)
4. Dashboard (main, enhanced, verification variants)
5. **Employment verification flows** (REDUCED):
   - ✅ Traditional employment path (Argyle)
   - ✅ Bank verification path
   - ✅ Manual upload path (paystub photos)
   - ❌ ~~Gig platform path~~ (REMOVED)
6. Education verification flow (10 screens with NSC)
7. Community service verification flow (4 screens)
8. Exemption flows (caregiver, disability, pregnancy, other) - **AUTO-APPROVAL**
9. Settings (simplified, no notification preferences)
10. Member-specific UI components

---

### Phase 4: Integration & Polish (Weeks 11-12) - ADDITIONS

**ADDED**:
- HIPAA compliance audit
- Security audit
- BAA execution with vendors
- Data warehouse setup
- ETL pipeline implementation

**Deliverables** (Updated):
1. Complete API integration (Argyle, NSC, Twilio)
2. Error handling and retry logic
3. Loading states and skeletons
4. Empty states
5. Form validation
6. Toast notifications
7. **HIPAA compliance audit** (NEW)
8. **Security audit** (NEW)
9. Accessibility audit and fixes
10. Keyboard navigation testing
11. Screen reader testing
12. Performance optimization
13. Unit tests
14. Integration tests
15. E2E tests
16. **Data warehouse deployment** (NEW)
17. Production deployment

---

## Risk Assessment Updates

### New High-Risk Items

1. **HIPAA Compliance** (NEW)
   - **Risk**: Comprehensive compliance required, affects entire architecture
   - **Mitigation**: Security audit, HIPAA training, BAAs with vendors, comprehensive audit logging

2. **Custom Workflows** (NEW)
   - **Risk**: Complexity of tenant-specific workflow customization
   - **Mitigation**: Careful design, phased rollout, documentation

3. **Data Warehouse** (NEW)
   - **Risk**: ETL pipeline complexity, data synchronization
   - **Mitigation**: Start with simple nightly batch, monitor data quality, plan for scaling

### Reduced Risk Items

1. **Gig Platform Integration** (REMOVED)
   - **Risk**: Eliminated - no longer in Phase 1
   - **Impact**: Significantly reduces integration complexity and vendor dependencies

2. **Session Management** (SIMPLIFIED)
   - **Risk**: Reduced - sliding session simpler than refresh token pattern
   - **Impact**: Easier implementation, better UX

---

## Updated Timeline

**Phase 1: Foundation** - Weeks 1-2 (NO CHANGE)
**Phase 2: Admin Experience** - Weeks 3-5 (NO CHANGE)
**Phase 3: Member Experience** - Weeks 6-10 (REDUCED SCOPE, SAME TIMELINE)
**Phase 4: Integration & Polish** - Weeks 11-12 (ADDED COMPLIANCE WORK)

**Total Timeline**: 12 weeks (UNCHANGED)

**Note**: Removal of gig platforms offsets added compliance work, keeping timeline stable.

---

## Next Steps

### Immediate Actions

1. ✅ Update all blueprint documents with resolved decisions
2. ⏳ Create HIPAA compliance checklist
3. ⏳ Update Phase 3 component list (remove gig screens)
4. ⏳ Update navigation.md (remove gig routes)
5. ⏳ Update component-io.md (remove gig components)
6. ⏳ Document Argyle integration requirements
7. ⏳ Document NSC integration requirements
8. ⏳ Document Twilio integration requirements
9. ⏳ Create data warehouse architecture document
10. ⏳ Create custom workflow design document

### Vendor Coordination

1. **Argyle**:
   - Initiate partnership discussion
   - Request sandbox access
   - Review HIPAA compliance documentation
   - Execute BAA

2. **National Student Clearinghouse**:
   - Initiate partnership discussion
   - Request API access
   - Review HIPAA compliance documentation
   - Execute BAA

3. **Twilio**:
   - Set up account
   - Provision phone number
   - Review HIPAA compliance documentation
   - Execute BAA

### Infrastructure Setup

1. Provision separate data warehouse database
2. Set up ETL pipeline infrastructure
3. Configure HIPAA-compliant logging
4. Set up audit log storage
5. Configure encryption at rest
6. Set up secure key management

---

## Summary

**Major Wins**:
- ✅ Reduced Phase 1 complexity (no gig platforms)
- ✅ Clearer authentication strategy (demo mode + sliding session)
- ✅ Confirmed integration partners (Argyle, NSC, Twilio)
- ✅ Automatic exemption approval (simpler workflow)

**Major Challenges**:
- ⚠️ HIPAA compliance adds significant security requirements
- ⚠️ Custom workflows add architectural complexity
- ⚠️ Data warehouse adds infrastructure complexity
- ⚠️ Multiple vendor BAAs required

**Net Impact**: Scope reduction (gig platforms) roughly offsets added complexity (HIPAA, data warehouse), keeping 12-week timeline feasible.
