# Ronda Ship — Entity Relationship Diagram

```mermaid
erDiagram
    Organization ||--o{ Membership : "has"
    Organization ||--o{ Quote : "owns"
    Organization ||--o{ Shipment : "owns"
    Organization ||--o{ Invoice : "owns"
    Organization ||--o{ Supplier : "has"
    Organization ||--o{ Contact : "has"
    Organization ||--o{ Lead : "has"
    Organization ||--o{ Deal : "has"
    Organization ||--o{ Document : "has"
    Organization ||--o{ ApiKey : "has"
    Organization ||--o{ Setting : "has"

    User ||--o{ Membership : "belongs to"
    User ||--o{ RefreshToken : "has"
    User ||--o{ AuditLog : "performs"

    Quote ||--o{ QuoteLineItem : "has"
    Quote ||--o{ CargoItem : "contains"
    Quote ||--o| Manifest : "generates"
    Quote ||--o| Booking : "converts to"
    Quote }o--o| Deal : "linked to"

    Booking ||--o| Shipment : "creates"

    Shipment ||--o{ ContainerAssignment : "uses"
    Shipment ||--o{ TrackingEvent : "has"
    Shipment ||--o{ Milestone : "tracks"
    Shipment ||--o{ Document : "requires"
    Shipment ||--o| InspectionReport : "has"
    Shipment ||--o{ Invoice : "billed via"
    Shipment ||--o{ ComplianceCheck : "checked by"
    Shipment ||--o| Manifest : "has"

    InspectionReport ||--o{ InspectionPhoto : "contains"
    InspectionReport ||--o{ InspectionCheckpoint : "has"

    Invoice ||--o{ InvoiceLineItem : "has"
    Invoice ||--o{ Payment : "receives"
    Invoice ||--o{ LedgerEntry : "posts"

    LedgerEntry }|--|| Account : "debits"
    LedgerEntry }|--|| Account : "credits"

    Contact ||--o{ Lead : "has"
    Contact ||--o{ Activity : "has"
    Lead ||--o{ Deal : "converts to"
    Deal ||--o{ Activity : "has"
    Deal ||--o{ Quote : "generates"

    Port ||--o{ TradeLane : "origin of"
    Port ||--o{ TradeLane : "dest of"
    TradeLane ||--o{ RateCard : "has"
    RateCard ||--o{ Surcharge : "includes"
    Carrier ||--o{ VesselSchedule : "operates"
    Carrier ||--o{ RateCard : "offers"
```

## Key Design Decisions

### Multi-tenancy
- `Organization` is the tenant root
- All tenant data is scoped via `organizationId`
- `Membership` table implements RBAC with `UserRole[]` array per member
- No shared tables between tenants except global reference data (ports, carriers, rate cards, compliance rules)

### Financial Data
- All monetary values stored as integer **minor units** (cents/halalas) to avoid floating-point issues
- `AccountingCategory` enum: `COGS | OPEX | DUTY_VAT | MARGIN` — drives P&L reporting
- Double-entry ledger: every invoice creates corresponding `LedgerEntry` records

### Audit Trail
- `AuditLog` captures before/after JSON for all mutations
- `TrackingEvent` is append-only (never updated, only created)
- `InspectionPhoto.sha256Hash` ensures photo integrity

### Compliance
- `ComplianceRule` stored in DB (overridable per deployment)
- Built-in rules also in `@ronda/core/compliance` for offline use
- `ComplianceCheck` records each check result per shipment

### Quote → Booking → Shipment Flow
```
Quote (DRAFT) → Quote (QUOTED) → Booking → Shipment (BOOKED → ... → DELIVERED)
```
