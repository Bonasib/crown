-- Removes the demo companies, their users and all their business records created by
-- packages/db/prisma/seed.ts. Keeps reference data (ports, carriers, trade lanes, rate
-- cards, compliance rules, accounts, feature flags, global settings) and admin@ronda.ship.
-- Runs as one transaction and refuses to run once any real (non-demo) company exists.
\set ON_ERROR_STOP on
BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM organizations WHERE slug NOT IN ('acme-imports', 'global-trade-co')) THEN
    RAISE EXCEPTION 'Real companies exist; refusing to delete data. Nothing was changed.';
  END IF;
END $$;

-- Children first: most relations restrict deletes.
DELETE FROM packing_plans;
DELETE FROM cargo_items;
DELETE FROM compliance_checks;
DELETE FROM fulfillment_shipment_plans;
DELETE FROM container_assignments;
DELETE FROM tracking_events;
DELETE FROM milestones;
DELETE FROM inspection_photos;
DELETE FROM inspection_checkpoints;
DELETE FROM inspection_reports;
DELETE FROM documents;
DELETE FROM payments;
DELETE FROM ledger_entries;
DELETE FROM invoice_line_items;
DELETE FROM invoices;
DELETE FROM manifests;
DELETE FROM shipments;
DELETE FROM bookings;
DELETE FROM quote_line_items;
DELETE FROM quotes;
DELETE FROM activities;
DELETE FROM deals;
DELETE FROM leads;
DELETE FROM contacts;
DELETE FROM suppliers;
DELETE FROM notifications;
DELETE FROM api_keys;
DELETE FROM settings WHERE "organizationId" IS NOT NULL;
DELETE FROM memberships;
DELETE FROM organizations;
DELETE FROM audit_logs;
DELETE FROM users WHERE email <> 'admin@ronda.ship';

COMMIT;

SELECT 'Demo data removed. Remaining users: ' || string_agg(email, ', ') FROM users;
