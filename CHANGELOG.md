# Changelog

All notable changes to Ronda Ship will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-05-27

### Added — Phase 0: Foundations

#### Infrastructure
- pnpm workspaces + Turborepo monorepo setup
- Docker Compose with PostgreSQL 16, Redis 7
- GitHub Actions CI (lint, typecheck, test, build)

#### Database (`packages/db`)
- Complete Prisma schema with 40+ models
- Multi-tenancy: `Organization`, `Membership`, RBAC via `UserRole[]`
- Freight: `Quote`, `QuoteLineItem`, `Booking`, `Shipment`, `ContainerAssignment`
- Tracking: `TrackingEvent`, `Milestone`, `VesselSchedule`
- Finance: `Invoice`, `InvoiceLineItem`, `Payment`, `LedgerEntry`, `Account`
- CRM: `Contact`, `Lead`, `Deal`, `Activity`
- Compliance: `ComplianceRule`, `ComplianceCheck`, `Document`
- Inspection: `InspectionReport`, `InspectionPhoto`, `InspectionCheckpoint`
- System: `AuditLog`, `FeatureFlag`, `Setting`, `Notification`, `WebhookSubscription`
- Seed data: 2 organizations, 5 users, ports, carriers, rate cards, quotes, shipments

#### Domain Logic (`packages/core`)
- Quoting engine: `calculateQuote()` with COGS/OPEX/MARGIN breakdown
- Packing planner: `recommendContainer()`, `generatePackingPlan()`
- Compliance checker: `checkCompliance()` with built-in rules for FBA/NOON markets
- Accounting: `calculateProfitLoss()`, `buildInvoiceJournalEntry()`

#### Design System (`packages/ui`)
- **Separate themes per app** via CSS custom properties
  - `web-saas`: Teal theme (#0D9488)
  - `web-erp`: Steel Navy theme (#1E3A5F)
  - `web-crm`: Amber/Coral theme (#D97706)
  - `web-admin`: Deep Purple theme (#4C1D95)
- Components: `Button`, `Card`, `Input`, `Badge`, `Label`, `Separator`
- Composite: `Sidebar`, `StatCard`, `DataTable`, `PageHeader`, `ShipmentStatusBadge`

#### Applications
- `web-saas` (port 3000): Customer portal with shipment tracking and quote booking
- `web-erp` (port 3001): Operations dashboard with dark navy sidebar
- `web-crm` (port 3002): Sales pipeline with deal management
- `web-admin` (port 3003): Platform admin with org management and feature flags

#### API (`apps/api`)
- Fastify v4 + tRPC v10 backend
- JWT authentication with refresh token rotation
- Routers: `auth`, `shipments`, `quotes`
- RBAC via tRPC middleware (`protectedProcedure`, `orgProcedure`, `requireRoles`)
- CORS, Helmet security headers

#### Worker (`apps/worker`)
- BullMQ workers: email-notifications, vessel-tracker, fx-rate-sync
- Scheduled jobs: FX rate sync (hourly), invoice reminders (daily)

#### Shared Packages
- `@ronda/types`: TypeScript domain types (enums, interfaces)
- `@ronda/config`: Shared tsconfig, tailwind config, eslint config

#### Documentation
- `docs/erd.md`: Mermaid ER diagram with design notes
- `DECISIONS.md`: Architecture Decision Records (ADR-001 through ADR-007)
- `README.md`: Setup and development guide
