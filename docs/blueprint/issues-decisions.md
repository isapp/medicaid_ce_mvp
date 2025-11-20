# Issues & Decisions

This document tracks open questions, architectural decisions, assumptions, and items requiring clarification for the Medicaid Community Engagement application.

## Open Questions

### Authentication & Authorization

#### Q1: Admin Authentication Method

**Question**: What authentication method should be used for admin users?

**Options**:
1. Email/password with local authentication
2. SSO/SAML integration with state identity providers
3. OAuth with Google/Microsoft
4. Multi-factor authentication (MFA) requirement

**Current Assumption**: Email/password authentication as documented in the blueprint

**Impact**: High - affects admin login implementation and security requirements

**Needs Input From**: Product team, security team, state agency requirements

---

#### Q2: Token Refresh Strategy

**Question**: Should we implement refresh tokens or rely on short-lived access tokens only?

**Options**:
1. Access token only (15-60 min expiry, re-login required)
2. Access + refresh token (access: 15 min, refresh: 7-30 days)
3. Sliding session (extend on activity)

**Current Assumption**: Access + refresh token pattern as documented

**Impact**: Medium - affects session management and user experience

**Needs Input From**: Backend team, security team

---

#### Q3: Session Timeout Duration

**Question**: What should the session timeout be for admin vs member users?

**Options**:
1. Admin: 30 minutes, Member: 24 hours
2. Admin: 60 minutes, Member: 7 days
3. Configurable per tenant

**Current Assumption**: 30 minutes for both as documented

**Impact**: Medium - affects user experience and security

**Needs Input From**: Product team, compliance team

---

### API & Backend Integration

#### Q4: API Base URL Configuration

**Question**: How should API base URLs be configured for different environments?

**Options**:
1. Environment variables only (VITE_API_BASE_URL)
2. Runtime configuration file (config.json)
3. Tenant-specific API endpoints

**Current Assumption**: Environment variables as documented

**Impact**: Low - standard practice, but needs confirmation

**Needs Input From**: DevOps team

---

#### Q5: File Upload Size Limits

**Question**: What are the maximum file sizes for document uploads?

**Options**:
1. 5 MB per file
2. 10 MB per file
3. 25 MB per file
4. Varies by document type

**Current Assumption**: Not specified in blueprint

**Impact**: Medium - affects validation and user experience

**Needs Input From**: Backend team, product team

---

#### Q6: Webhook Security

**Question**: How should webhooks from employment/education verification vendors be secured?

**Options**:
1. HMAC signature verification
2. API key authentication
3. IP whitelist
4. Combination of above

**Current Assumption**: Signature verification as mentioned in API docs

**Impact**: High - security critical

**Needs Input From**: Backend team, integration partners

---

### Employment Verification

#### Q7: Gig Platform Integration Partners

**Question**: Which gig platforms will be integrated in Phase 1?

**Options**:
1. Uber, Lyft, DoorDash, Instacart (as shown in Figma)
2. Subset of above
3. Additional platforms (Grubhub, Postmates, etc.)

**Current Assumption**: Uber, Lyft, DoorDash, Instacart as shown in Figma

**Impact**: High - affects integration work and vendor negotiations

**Needs Input From**: Product team, partnerships team

---

#### Q8: Payroll Integration Partners

**Question**: Which payroll providers will be integrated?

**Options**:
1. Argyle (as mentioned in Figma)
2. Pinwheel
3. Atomic
4. Multiple providers

**Current Assumption**: Argyle as shown in Figma

**Impact**: High - affects integration work and vendor costs

**Needs Input From**: Product team, partnerships team

---

#### Q9: Manual Verification Processing Time

**Question**: What is the expected processing time for manually uploaded documents?

**Options**:
1. 24 hours
2. 2-3 business days (as mentioned in success screen)
3. 5 business days
4. Varies by case load

**Current Assumption**: 2-3 business days as shown in Figma

**Impact**: Medium - affects user expectations and messaging

**Needs Input From**: Operations team, product team

---

### Education Verification

#### Q10: Education Verification Method

**Question**: How will education enrollment be verified?

**Options**:
1. National Student Clearinghouse integration
2. Direct school portal integrations
3. Manual document upload only
4. Combination of above

**Current Assumption**: Automated + manual as shown in Figma

**Impact**: High - affects implementation complexity

**Needs Input From**: Product team, partnerships team

---

### Exemptions

#### Q11: Exemption Approval Workflow

**Question**: What is the approval workflow for exemptions?

**Options**:
1. Automatic approval based on criteria
2. Manual review by case worker
3. Two-stage review (case worker + supervisor)
4. Varies by exemption type

**Current Assumption**: Manual review as implied by "pending" status

**Impact**: High - affects admin workflow and case management

**Needs Input From**: Product team, state agency requirements

---

#### Q12: Exemption Duration Limits

**Question**: Are there maximum durations for different exemption types?

**Options**:
1. No limits (user-specified start/end dates)
2. Pregnancy: 9 months, Caregiver: 12 months, etc.
3. Configurable per tenant
4. State-specific regulations

**Current Assumption**: User-specified dates with no enforced limits

**Impact**: Medium - affects validation and compliance

**Needs Input From**: Compliance team, state regulations

---

### Notifications & Messaging

#### Q13: SMS Provider

**Question**: Which SMS provider should be used for authentication codes and notifications?

**Options**:
1. Twilio
2. AWS SNS
3. MessageBird
4. Other

**Current Assumption**: Not specified

**Impact**: Medium - affects implementation and costs

**Needs Input From**: Backend team, DevOps team

---

#### Q14: Notification Preferences

**Question**: Can members opt out of certain notifications?

**Options**:
1. All notifications required (compliance)
2. Opt-out of reminders only
3. Full notification preferences

**Current Assumption**: Configurable per tenant in settings

**Impact**: Medium - affects settings UI and notification logic

**Needs Input From**: Product team, compliance team

---

### Multi-Tenancy

#### Q15: Tenant Onboarding Process

**Question**: How are new tenants (state agencies) onboarded?

**Options**:
1. Manual database setup by engineering
2. Admin portal for tenant creation
3. Self-service signup
4. Terraform/IaC automation

**Current Assumption**: Not specified in blueprint

**Impact**: Medium - affects scalability and operations

**Needs Input From**: Product team, DevOps team

---

#### Q16: Tenant Customization

**Question**: What level of customization is allowed per tenant?

**Options**:
1. Branding only (logo, colors)
2. Feature toggles (modules enabled/disabled)
3. Custom workflows
4. Full white-label

**Current Assumption**: Feature toggles via settings as documented

**Impact**: High - affects architecture and complexity

**Needs Input From**: Product team, engineering leadership

---

### Data & Privacy

#### Q17: Data Retention Policy

**Question**: How long should participant data be retained?

**Options**:
1. Indefinitely
2. 7 years (standard government retention)
3. Configurable per tenant
4. Varies by data type

**Current Assumption**: Not specified

**Impact**: High - compliance and legal requirements

**Needs Input From**: Legal team, compliance team

---

#### Q18: PII Handling

**Question**: Are there special requirements for handling PII (Personally Identifiable Information)?

**Options**:
1. Standard encryption at rest and in transit
2. Field-level encryption for sensitive data
3. Tokenization of SSN/Medicaid ID
4. HIPAA compliance requirements

**Current Assumption**: Standard encryption (HTTPS, encrypted database)

**Impact**: High - security and compliance critical

**Needs Input From**: Security team, compliance team, legal team

---

### Reporting & Analytics

#### Q19: Reporting Data Warehouse

**Question**: Should reporting use the same database or a separate data warehouse?

**Options**:
1. Same database with read replicas
2. Separate analytics database (ETL pipeline)
3. Third-party BI tool integration
4. Real-time queries only

**Current Assumption**: Same database as implied by reporting endpoints

**Impact**: Medium - affects performance and scalability

**Needs Input From**: Backend team, data team

---

#### Q20: Export Formats

**Question**: What export formats should be supported for reports?

**Options**:
1. CSV only
2. CSV + Excel
3. CSV + Excel + PDF
4. Configurable per report

**Current Assumption**: Not specified

**Impact**: Low - nice to have feature

**Needs Input From**: Product team

---

## Architectural Decisions

### AD1: React Query for Server State

**Decision**: Use React Query (TanStack Query) for all server state management

**Rationale**:
- Industry standard for server state in React
- Built-in caching, refetching, and optimistic updates
- Excellent TypeScript support
- Reduces boilerplate compared to Redux

**Alternatives Considered**:
- Redux Toolkit with RTK Query
- SWR
- Apollo Client (if GraphQL)

**Trade-offs**:
- Learning curve for team members unfamiliar with React Query
- Additional dependency

**Status**: Decided

---

### AD2: Zustand for Feature State

**Decision**: Use Zustand for multi-step flow state (Employment, Education, Exemption flows)

**Rationale**:
- Lightweight and simple API
- Built-in persistence support
- No boilerplate compared to Redux
- Works well alongside React Query

**Alternatives Considered**:
- React Context (too much re-rendering)
- Redux (too much boilerplate)
- Local component state (lost on navigation)

**Trade-offs**:
- Less ecosystem/tooling than Redux
- Team needs to learn another state library

**Status**: Decided

---

### AD3: React Hook Form + Zod

**Decision**: Use React Hook Form with Zod for all form handling and validation

**Rationale**:
- Excellent performance (uncontrolled inputs)
- Built-in validation with Zod schemas
- Type inference from Zod schemas
- Accessibility support

**Alternatives Considered**:
- Formik
- Manual form handling
- React Final Form

**Trade-offs**:
- Learning curve for Zod schema syntax
- Two libraries instead of one

**Status**: Decided

---

### AD4: Radix UI for Primitives

**Decision**: Use Radix UI primitives with custom styling

**Rationale**:
- Unstyled, accessible components
- Full keyboard navigation support
- WCAG 2.1 AA compliant out of the box
- Composable and flexible

**Alternatives Considered**:
- Headless UI
- Reach UI
- Building from scratch

**Trade-offs**:
- Requires custom styling (not a complete UI library)
- Learning curve for composition patterns

**Status**: Decided

---

### AD5: CSS Variables for Theming

**Decision**: Use CSS variables exclusively for colors, spacing, and typography

**Rationale**:
- Runtime theme switching without CSS-in-JS overhead
- Simple to understand and maintain
- No build-time constraints
- Works with any styling solution

**Alternatives Considered**:
- Tailwind theme configuration
- CSS-in-JS (styled-components, emotion)
- SCSS variables

**Trade-offs**:
- No type safety for CSS variables
- Requires discipline to use variables consistently

**Status**: Decided

---

### AD6: Route-Based Code Splitting

**Decision**: Code split by route using React.lazy and Suspense

**Rationale**:
- Reduces initial bundle size
- Faster initial page load
- Natural split points (admin vs member)
- Built into React

**Alternatives Considered**:
- No code splitting (simpler but larger bundle)
- Component-level splitting (more complex)
- Route + component splitting

**Trade-offs**:
- Slight delay when navigating to new routes
- More complex build output

**Status**: Decided

---

### AD7: localStorage for Token Storage

**Decision**: Use localStorage for JWT token storage (not httpOnly cookies)

**Rationale**:
- Simpler implementation (no CSRF protection needed)
- Works with any backend
- Easy to implement token refresh
- Standard practice for SPAs

**Alternatives Considered**:
- httpOnly cookies (more secure but requires CSRF protection)
- sessionStorage (lost on tab close)
- In-memory only (lost on refresh)

**Trade-offs**:
- Vulnerable to XSS attacks (mitigated by CSP)
- Tokens accessible to JavaScript

**Status**: Decided (but open to reconsideration for httpOnly cookies)

---

### AD8: Mobile-First CSS

**Decision**: Write all CSS mobile-first with min-width media queries

**Rationale**:
- Member experience is mobile-only
- Easier to progressively enhance
- Better performance on mobile
- Industry best practice

**Alternatives Considered**:
- Desktop-first (legacy approach)
- Separate mobile/desktop stylesheets

**Trade-offs**:
- Requires discipline to think mobile-first
- More media queries in code

**Status**: Decided

---

### AD9: Monorepo Structure

**Decision**: Keep frontend and backend in separate directories within monorepo

**Rationale**:
- Shared types between frontend and backend
- Atomic commits across full stack
- Simplified deployment coordination
- Single repository to manage

**Alternatives Considered**:
- Separate repositories
- Polyrepo with shared packages

**Trade-offs**:
- Larger repository
- Need tooling for independent deployments

**Status**: Decided (already implemented in starter repo)

---

### AD10: Vite for Build Tool

**Decision**: Use Vite for frontend build and development

**Rationale**:
- Fast HMR (Hot Module Replacement)
- Modern ESM-based builds
- Excellent TypeScript support
- Growing ecosystem

**Alternatives Considered**:
- Create React App (deprecated)
- Next.js (overkill for SPA)
- Webpack (slower)

**Trade-offs**:
- Newer tool (less mature than Webpack)
- Some plugins may not be available

**Status**: Decided (already configured in starter repo)

---

## Assumptions

### Technical Assumptions

1. **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions)
2. **Mobile OS**: iOS 14+ and Android 10+
3. **Network**: Reliable internet connection (no offline mode in Phase 1)
4. **Screen Sizes**: Admin: 1280px-1920px, Member: 375px-428px
5. **Backend API**: RESTful JSON API (not GraphQL)
6. **Database**: PostgreSQL with multi-tenant schema
7. **Deployment**: Cloud-hosted (AWS, GCP, or Azure)
8. **CI/CD**: GitHub Actions or similar
9. **Monitoring**: Application monitoring and error tracking in place
10. **CDN**: Static assets served via CDN

### Business Assumptions

1. **User Base**: State Medicaid agencies as tenants, beneficiaries as end users
2. **Scale**: 10,000-100,000 beneficiaries per tenant
3. **Concurrent Users**: 100-1,000 concurrent users per tenant
4. **Growth**: 10x growth over 2 years
5. **Compliance**: HIPAA, Section 508, WCAG 2.1 AA required
6. **Languages**: English only in Phase 1
7. **Support**: In-app support (no live chat in Phase 1)
8. **Training**: Admin users receive training before access
9. **Member Literacy**: 5th-6th grade reading level target
10. **Device Access**: Members have access to smartphone

### Integration Assumptions

1. **Gig Platforms**: APIs available from Uber, Lyft, DoorDash, Instacart
2. **Payroll**: Argyle integration available
3. **Education**: National Student Clearinghouse or similar available
4. **SMS**: Twilio or similar SMS provider
5. **Email**: SendGrid or similar email provider (if needed)
6. **Document Storage**: S3 or similar object storage
7. **Identity Verification**: Not required in Phase 1
8. **Payment Processing**: Not required (no payments in app)
9. **Background Checks**: Not required in Phase 1
10. **Third-Party Analytics**: Google Analytics or similar allowed

## Items for Backend Team

### API Endpoints to Implement

All endpoints documented in `api-integration.md` need to be implemented:

1. **Authentication**: Admin login, member phone auth, token refresh
2. **Beneficiaries**: CRUD operations, notes, dashboard summary
3. **Cases**: CRUD operations, notes, bulk actions
4. **Employment Activities**: CRUD operations, verification, webhooks
5. **Education Activities**: CRUD operations, verification
6. **Volunteer Activities**: CRUD operations
7. **Exemptions**: CRUD operations, approval workflow
8. **Broadcasts**: CRUD operations, scheduling, sending
9. **Documents**: Upload, download, delete
10. **Settings**: Tenant settings, integrations
11. **Reporting**: Overview, compliance reports
12. **Users**: Admin user management

### Data Models to Implement

All data models documented in `data-models.md` need corresponding database tables:

1. **users**: Admin and member users
2. **tenants**: State agencies
3. **beneficiaries**: Medicaid beneficiaries
4. **cases**: Case management records
5. **notes**: Notes on beneficiaries and cases
6. **employment_activities**: Employment verification records
7. **education_activities**: Education verification records
8. **volunteer_activities**: Community service records
9. **exemptions**: Exemption applications
10. **broadcasts**: Broadcast messages
11. **documents**: File metadata
12. **integrations**: Third-party integration configs
13. **settings**: Tenant-specific settings

### Multi-Tenancy Implementation

- All tables need `tenant_id` column
- Row-level security policies for tenant isolation
- JWT tokens include `tenant_id` claim
- All queries filtered by tenant_id automatically

### Webhook Endpoints

- Employment verification webhooks (Argyle, gig platforms)
- Education verification webhooks (NSC)
- SMS delivery status webhooks (Twilio)

### Background Jobs

- Scheduled broadcast sending
- Reminder notifications (deadlines approaching)
- Data cleanup/archival
- Report generation
- Integration sync jobs

## Items for DevOps Team

### Infrastructure Requirements

1. **Environments**: Development, Staging, Production
2. **Databases**: PostgreSQL with read replicas
3. **Object Storage**: S3 or equivalent for documents
4. **CDN**: CloudFront or equivalent for static assets
5. **Load Balancer**: Application load balancer
6. **SSL Certificates**: HTTPS for all environments
7. **Monitoring**: Application and infrastructure monitoring
8. **Logging**: Centralized logging (CloudWatch, Datadog, etc.)
9. **Secrets Management**: Vault, AWS Secrets Manager, etc.
10. **Backup**: Automated database backups

### CI/CD Pipeline

1. **Build**: Frontend build on commit
2. **Test**: Run unit and integration tests
3. **Lint**: ESLint, TypeScript checks
4. **Deploy**: Automated deployment to staging
5. **Manual Approval**: Production deployment requires approval
6. **Rollback**: Ability to rollback deployments

### Environment Variables

Frontend needs:
- `VITE_API_BASE_URL`: API endpoint
- `VITE_ENVIRONMENT`: dev/staging/production
- `VITE_SENTRY_DSN`: Error tracking (optional)

Backend needs:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Token signing secret
- `TWILIO_ACCOUNT_SID`: SMS provider
- `TWILIO_AUTH_TOKEN`: SMS provider
- `AWS_ACCESS_KEY_ID`: S3 access
- `AWS_SECRET_ACCESS_KEY`: S3 access
- `ARGYLE_CLIENT_ID`: Employment verification
- `ARGYLE_CLIENT_SECRET`: Employment verification

## Items for Design Team

### Missing Assets

1. **Logos**: Application logo, tenant logos
2. **Icons**: Custom icons for verification methods
3. **Illustrations**: Empty states, success screens
4. **Platform Logos**: Uber, Lyft, DoorDash, Instacart, etc.
5. **Loading Animations**: Custom loading animations (optional)

### Design Clarifications Needed

1. **Admin Dashboard**: Not present in Figma export
2. **Reporting Screens**: Limited detail in Figma
3. **Settings Screens**: Partial implementation in Figma
4. **Error States**: Not all error states designed
5. **Loading States**: Not all loading states designed

### Responsive Breakpoints

Need designs for:
1. **Tablet (768px-1023px)**: Admin experience on tablet
2. **Small Desktop (1024px-1279px)**: Admin experience on small screens

## Risk Assessment

### High Risk Items

1. **Integration Dependencies**: Reliance on third-party APIs (Argyle, gig platforms)
   - **Mitigation**: Fallback to manual verification
   
2. **Multi-Tenancy Security**: Data isolation between tenants
   - **Mitigation**: Row-level security, thorough testing, security audit
   
3. **PII/PHI Handling**: Sensitive data protection
   - **Mitigation**: Encryption, access controls, compliance review
   
4. **SMS Delivery**: Critical for member authentication
   - **Mitigation**: Backup authentication method, monitoring, SLA with provider

### Medium Risk Items

1. **Browser Compatibility**: Modern browser features
   - **Mitigation**: Polyfills, progressive enhancement, browser testing
   
2. **Mobile Device Fragmentation**: Various screen sizes and OS versions
   - **Mitigation**: Responsive design, device testing, safe area handling
   
3. **Performance at Scale**: Large datasets, concurrent users
   - **Mitigation**: Pagination, caching, load testing, database optimization
   
4. **Third-Party Downtime**: Integration partner outages
   - **Mitigation**: Graceful degradation, status monitoring, user communication

### Low Risk Items

1. **Design System Consistency**: Maintaining design tokens
   - **Mitigation**: CSS variables, component library, design reviews
   
2. **Code Quality**: Maintaining standards across team
   - **Mitigation**: ESLint, TypeScript, code reviews, documentation
   
3. **Accessibility Compliance**: Meeting WCAG 2.1 AA
   - **Mitigation**: Radix UI, automated testing, manual testing, accessibility audit

## Next Steps

### Immediate Actions

1. **Review Blueprint**: Product team reviews all documentation
2. **Answer Open Questions**: Resolve Q1-Q20 above
3. **Backend Planning**: Backend team reviews API and data model requirements
4. **Design Completion**: Design team provides missing assets and screens
5. **DevOps Setup**: Infrastructure and CI/CD pipeline setup

### Phase 1 Kickoff

1. **Sprint Planning**: Break down Phase 1 into 2-week sprints
2. **Team Assignment**: Assign features to frontend/backend developers
3. **Integration Coordination**: Coordinate with third-party vendors
4. **Testing Strategy**: Define testing approach and tools
5. **Documentation**: Create developer onboarding guide

### Success Criteria

1. **Technical**: All Phase 1 features implemented and tested
2. **Performance**: Page load < 3s, API response < 500ms
3. **Accessibility**: WCAG 2.1 AA compliance verified
4. **Security**: Security audit passed
5. **User Acceptance**: UAT with pilot tenant successful

## Summary

This document captures 20 open questions requiring clarification, 10 architectural decisions with rationale, 30+ assumptions across technical/business/integration domains, and detailed items for backend, DevOps, and design teams. All risks are assessed with mitigation strategies, and next steps are clearly defined for project kickoff.
