# Technical Implementation Blueprint

This directory contains the comprehensive technical implementation plan for the Medicaid Community Engagement application.

## Overview

The blueprint provides detailed specifications for implementing a multi-tenant SaaS application with two distinct user experiences:

- **Admin Experience**: Desktop-focused interface for case workers and administrators
- **Member Experience**: Mobile-first interface for Medicaid beneficiaries

## Blueprint Documents

### Core Architecture

1. **[Main Blueprint](./blueprint.md)** - Executive overview and implementation roadmap
2. **[Navigation Structure](./navigation.md)** - Routing, URL structure, and navigation patterns
3. **[State Architecture](./state-architecture.md)** - State management strategy and data flow
4. **[API Integration Plan](./api-integration.md)** - API client, endpoints, and integration patterns
5. **[Data Models](./data-models.md)** - TypeScript interfaces and domain entities
6. **[Authentication Flows](./auth-flows.md)** - Auth implementation and session management
7. **[Error & Loading States](./error-loading.md)** - Error handling and loading patterns
8. **[Mobile & Accessibility](./mobile-accessibility.md)** - Mobile-first behavior and WCAG compliance
9. **[Component I/O Contracts](./component-io.md)** - Props, events, and side effects for major components
10. **[Issues & Decisions](./issues-decisions.md)** - Open questions and architectural decisions

### Supporting Documents

- **[Design System Guidelines](../figma-analysis/design-system-guidelines.md)** - Typography, colors, spacing, and theming
- **[Component Architecture Map](../figma-analysis/component-architecture-map.md)** - Component inventory and hierarchy
- **[API Contracts](../api-contracts.md)** - Existing API contract specifications
- **[Architecture Overview](../architecture.md)** - System architecture and multi-tenancy model

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Theme system and design tokens
- Shared UI primitives (45 components)
- Routing infrastructure
- API client and authentication
- State management setup

### Phase 2: Admin Experience (Weeks 3-5)
- Admin layout and navigation
- Participant and case management
- Broadcasts and reporting
- Settings and user management

### Phase 3: Member Experience (Weeks 6-10)
- Mobile layout and navigation
- Authentication and assessment flows
- Employment verification (4 paths)
- Education, exemptions, and community service

### Phase 4: Integration & Polish (Weeks 11-12)
- API integration and testing
- Accessibility audit
- Performance optimization
- Production deployment

## Quick Start

1. Read the [Main Blueprint](./blueprint.md) for the executive overview
2. Review [Navigation Structure](./navigation.md) and [State Architecture](./state-architecture.md) to understand the application structure
3. Study [Data Models](./data-models.md) and [API Integration Plan](./api-integration.md) for backend integration
4. Reference [Component I/O Contracts](./component-io.md) when implementing features
5. Check [Issues & Decisions](./issues-decisions.md) for open questions and assumptions

## Key Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **State Management**: React Query (server state), Zustand (feature state), Context (auth)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives with custom theming
- **Styling**: CSS variables with theme tokens
- **Charts**: Recharts
- **Notifications**: Sonner

## Architecture Principles

1. **Multi-tenancy**: All data scoped by tenant_id
2. **Theme-aware components**: Support both Admin and Member themes via CSS variables
3. **Mobile-first**: Member experience optimized for mobile devices
4. **Accessibility-first**: WCAG 2.1 AA compliance built in
5. **Type-safe**: TypeScript throughout with Zod runtime validation
6. **Separation of concerns**: Clear boundaries between UI, state, and API layers
7. **Progressive enhancement**: Core functionality works, enhanced features layer on top

## Contributing

When implementing features:

1. Follow the specifications in this blueprint
2. Reference the [Design System Guidelines](../figma-analysis/design-system-guidelines.md) for styling
3. Use the [Component Architecture Map](../figma-analysis/component-architecture-map.md) for component organization
4. Document any deviations or new decisions in [Issues & Decisions](./issues-decisions.md)
5. Update relevant blueprint documents when making architectural changes

## Questions?

For clarifications or to propose changes to the blueprint, update the [Issues & Decisions](./issues-decisions.md) document with your question or proposal.
