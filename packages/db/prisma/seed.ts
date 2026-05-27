import { PrismaClient, FreightMode, GoodsType, ShipmentStatus, UserRole, DealStage } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  // SHA-256 hash for seed data (use bcrypt in production)
  return createHash('sha256').update(password + 'salt_ronda_2024').digest('hex');
}

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Ports ────────────────────────────────────────────────────────────────

  const ports = await prisma.port.createMany({
    data: [
      { code: 'CNSHA', name: 'Shanghai', country: 'CN', lat: 31.23, lng: 121.47, isOrigin: true },
      { code: 'CNNGB', name: 'Ningbo', country: 'CN', lat: 29.87, lng: 121.54, isOrigin: true },
      { code: 'CNSZX', name: 'Shenzhen (Yantian)', country: 'CN', lat: 22.56, lng: 114.26, isOrigin: true },
      { code: 'SAJED', name: 'Jeddah Islamic Port', country: 'SA', lat: 21.53, lng: 39.15, isDest: true },
      { code: 'AEDXB', name: 'Port of Dubai (Jebel Ali)', country: 'AE', lat: 24.97, lng: 55.06, isDest: true },
      { code: 'USLAX', name: 'Los Angeles', country: 'US', lat: 33.74, lng: -118.26, isDest: true },
      { code: 'DEHAM', name: 'Hamburg', country: 'DE', lat: 53.55, lng: 9.97, isDest: true },
      { code: 'GBFXT', name: 'Felixstowe', country: 'GB', lat: 51.96, lng: 1.35, isDest: true },
    ],
    skipDuplicates: true,
  });
  console.log(`  Created ${ports.count} ports`);

  // ─── Carriers ─────────────────────────────────────────────────────────────

  const [maersk, msc, cosco] = await Promise.all([
    prisma.carrier.upsert({
      where: { scac: 'MAEU' },
      update: {},
      create: { name: 'Maersk Line', scac: 'MAEU' },
    }),
    prisma.carrier.upsert({
      where: { scac: 'MSCU' },
      update: {},
      create: { name: 'MSC', scac: 'MSCU' },
    }),
    prisma.carrier.upsert({
      where: { scac: 'COSU' },
      update: {},
      create: { name: 'COSCO Shipping', scac: 'COSU' },
    }),
  ]);
  console.log('  Created 3 carriers');

  // ─── Trade Lanes + Rate Cards ──────────────────────────────────────────────

  const sha = await prisma.port.findUnique({ where: { code: 'CNSHA' } });
  const jed = await prisma.port.findUnique({ where: { code: 'SAJED' } });
  const dxb = await prisma.port.findUnique({ where: { code: 'AEDXB' } });
  const lax = await prisma.port.findUnique({ where: { code: 'USLAX' } });

  if (sha && jed) {
    const lane1 = await prisma.tradeLane.upsert({
      where: { originPortId_destPortId_mode: { originPortId: sha.id, destPortId: jed.id, mode: FreightMode.FCL } },
      update: {},
      create: { originPortId: sha.id, destPortId: jed.id, mode: FreightMode.FCL, transitDays: 22 },
    });

    await prisma.rateCard.create({
      data: {
        tradeLaneId: lane1.id,
        carrierId: maersk.id,
        mode: FreightMode.FCL,
        containerType: 'FORTY_FT',
        baseRateMinor: 180000, // $1,800
        currency: 'USD',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2025-12-31'),
        surcharges: {
          create: [
            { name: 'BAF', code: 'BAF', accountingCategory: 'COGS', amountMinor: 25000, currency: 'USD' },
            { name: 'THC Origin', code: 'THCO', accountingCategory: 'COGS', amountMinor: 18000, currency: 'USD' },
            { name: 'THC Destination', code: 'THCD', accountingCategory: 'COGS', amountMinor: 15000, currency: 'USD' },
          ],
        },
      },
    });
  }

  if (sha && dxb) {
    const lane2 = await prisma.tradeLane.upsert({
      where: { originPortId_destPortId_mode: { originPortId: sha.id, destPortId: dxb.id, mode: FreightMode.FCL } },
      update: {},
      create: { originPortId: sha.id, destPortId: dxb.id, mode: FreightMode.FCL, transitDays: 20 },
    });

    await prisma.rateCard.create({
      data: {
        tradeLaneId: lane2.id,
        carrierId: msc.id,
        mode: FreightMode.FCL,
        containerType: 'FORTY_FT',
        baseRateMinor: 160000, // $1,600
        currency: 'USD',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2025-12-31'),
      },
    });
  }

  console.log('  Created trade lanes and rate cards');

  // ─── Compliance Rules ─────────────────────────────────────────────────────

  await prisma.complianceRule.createMany({
    data: [
      {
        market: 'FBA_SA',
        documentType: 'COMMERCIAL_INVOICE',
        description: 'Commercial invoice required for all FBA Saudi Arabia shipments',
        isBlocking: true,
      },
      {
        market: 'FBA_SA',
        documentType: 'PACKING_LIST',
        description: 'Packing list required for FBA Saudi Arabia',
        isBlocking: true,
      },
      {
        market: 'FBA_SA',
        documentType: 'COO',
        description: 'Certificate of Origin required for Saudi Customs',
        isBlocking: true,
      },
      {
        market: 'FBA_US',
        documentType: 'COMMERCIAL_INVOICE',
        description: 'Commercial invoice required for US Customs',
        isBlocking: true,
      },
      {
        market: 'FBA_US',
        documentType: 'BILL_OF_LADING',
        description: 'Bill of Lading required for US import',
        isBlocking: true,
      },
      {
        goodsType: 'HAZARDOUS',
        documentType: 'MSDS',
        description: 'MSDS sheet required for hazardous goods',
        isBlocking: true,
      },
      {
        goodsType: 'HAZARDOUS',
        documentType: 'DG_DECLARATION',
        description: 'Dangerous Goods Declaration required',
        isBlocking: true,
      },
      {
        goodsType: 'FOOD',
        documentType: 'PHYTOSANITARY',
        description: 'Phytosanitary certificate required for food items',
        isBlocking: false,
      },
    ],
    skipDuplicates: true,
  });
  console.log('  Created compliance rules');

  // ─── Chart of Accounts ────────────────────────────────────────────────────

  await prisma.account.createMany({
    data: [
      { code: '1000', name: 'Cash & Equivalents', type: 'ASSET' },
      { code: '1200', name: 'Accounts Receivable', type: 'ASSET' },
      { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
      { code: '4000', name: 'Freight Revenue', type: 'REVENUE' },
      { code: '4100', name: 'Inspection Revenue', type: 'REVENUE' },
      { code: '5000', name: 'Freight Cost (COGS)', type: 'EXPENSE' },
      { code: '5100', name: 'Port & Handling (COGS)', type: 'EXPENSE' },
      { code: '5200', name: 'Duties & VAT', type: 'EXPENSE' },
      { code: '6000', name: 'Inspection Opex', type: 'EXPENSE' },
      { code: '6100', name: 'Admin Opex', type: 'EXPENSE' },
    ],
    skipDuplicates: true,
  });
  console.log('  Created chart of accounts');

  // ─── Feature Flags ────────────────────────────────────────────────────────

  await prisma.featureFlag.createMany({
    data: [
      { key: 'ai_quote_suggestions', description: 'Enable AI-powered quote suggestions', isEnabled: false },
      { key: 'stripe_payments', description: 'Enable Stripe payment processing', isEnabled: false },
      { key: 'vessel_tracking_api', description: 'Enable live vessel tracking via API', isEnabled: false },
      { key: 'whatsapp_notifications', description: 'Enable WhatsApp notifications', isEnabled: false },
      { key: 'multi_currency', description: 'Enable multi-currency invoicing', isEnabled: true },
    ],
    skipDuplicates: true,
  });
  console.log('  Created feature flags');

  // ─── Organizations ─────────────────────────────────────────────────────────

  const acme = await prisma.organization.upsert({
    where: { slug: 'acme-imports' },
    update: {},
    create: {
      name: 'ACME Imports Ltd',
      slug: 'acme-imports',
      country: 'SA',
      taxId: 'SA123456789',
      planId: 'pro',
    },
  });

  const globalTrade = await prisma.organization.upsert({
    where: { slug: 'global-trade-co' },
    update: {},
    create: {
      name: 'Global Trade Co',
      slug: 'global-trade-co',
      country: 'AE',
      taxId: 'AE987654321',
      planId: 'starter',
    },
  });
  console.log('  Created 2 organizations');

  // ─── Users ─────────────────────────────────────────────────────────────────

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@ronda.ship' },
    update: {},
    create: {
      email: 'admin@ronda.ship',
      emailVerified: true,
      passwordHash: hashPassword('Admin123!'),
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
    },
  });

  const acmeOwner = await prisma.user.upsert({
    where: { email: 'owner@acme-imports.com' },
    update: {},
    create: {
      email: 'owner@acme-imports.com',
      emailVerified: true,
      passwordHash: hashPassword('Owner123!'),
      firstName: 'Ahmed',
      lastName: 'Al-Rashid',
      phone: '+966501234567',
      isActive: true,
    },
  });

  const acmeBooker = await prisma.user.upsert({
    where: { email: 'logistics@acme-imports.com' },
    update: {},
    create: {
      email: 'logistics@acme-imports.com',
      emailVerified: true,
      passwordHash: hashPassword('Booker123!'),
      firstName: 'Sara',
      lastName: 'Mohammed',
      isActive: true,
    },
  });

  const globalOwner = await prisma.user.upsert({
    where: { email: 'owner@global-trade-co.com' },
    update: {},
    create: {
      email: 'owner@global-trade-co.com',
      emailVerified: true,
      passwordHash: hashPassword('Owner123!'),
      firstName: 'Khalid',
      lastName: 'Al-Mansouri',
      phone: '+971501234567',
      isActive: true,
    },
  });

  const salesRep = await prisma.user.upsert({
    where: { email: 'sales@ronda.ship' },
    update: {},
    create: {
      email: 'sales@ronda.ship',
      emailVerified: true,
      passwordHash: hashPassword('Sales123!'),
      firstName: 'Maria',
      lastName: 'Santos',
      isActive: true,
    },
  });

  console.log('  Created 5 users');

  // ─── Memberships ──────────────────────────────────────────────────────────

  await prisma.membership.createMany({
    data: [
      // Super admin has no org membership (global)
      {
        userId: acmeOwner.id,
        organizationId: acme.id,
        roles: [UserRole.ORG_OWNER, UserRole.BOOKER],
        isOwner: true,
        joinedAt: new Date(),
      },
      {
        userId: acmeBooker.id,
        organizationId: acme.id,
        roles: [UserRole.BOOKER],
        isOwner: false,
        joinedAt: new Date(),
      },
      {
        userId: globalOwner.id,
        organizationId: globalTrade.id,
        roles: [UserRole.ORG_OWNER, UserRole.BOOKER],
        isOwner: true,
        joinedAt: new Date(),
      },
      {
        userId: salesRep.id,
        organizationId: acme.id,
        roles: [UserRole.SALES_REP],
        isOwner: false,
        joinedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  console.log('  Created memberships');

  // ─── Suppliers ────────────────────────────────────────────────────────────

  const supplier1 = await prisma.supplier.create({
    data: {
      organizationId: acme.id,
      name: 'Shenzhen Electronics Factory',
      country: 'CN',
      city: 'Shenzhen',
      contactName: 'Mr. Zhang Wei',
      contactEmail: 'zhang@sz-electronics.cn',
      contactPhone: '+8613812345678',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      organizationId: acme.id,
      name: 'Guangzhou Textiles Co',
      country: 'CN',
      city: 'Guangzhou',
      contactName: 'Ms. Li Mei',
      contactEmail: 'li@gz-textiles.cn',
    },
  });
  console.log('  Created 2 suppliers');

  // ─── Contacts & CRM ──────────────────────────────────────────────────────

  const contact1 = await prisma.contact.create({
    data: {
      organizationId: acme.id,
      firstName: 'Hassan',
      lastName: 'Al-Farsi',
      email: 'hassan@buyer-corp.sa',
      phone: '+966502345678',
      company: 'Buyer Corp Saudi',
      position: 'Procurement Manager',
    },
  });

  const lead1 = await prisma.lead.create({
    data: {
      organizationId: acme.id,
      contactId: contact1.id,
      assignedToId: salesRep.id,
      source: 'WEBSITE',
      status: 'QUALIFIED',
    },
  });

  const deal1 = await prisma.deal.create({
    data: {
      organizationId: acme.id,
      leadId: lead1.id,
      assignedToId: salesRep.id,
      title: 'Electronics FCL - Q1 2025',
      stage: DealStage.QUOTED,
      valueMinor: 1500000, // $15,000
      currency: 'USD',
      probability: 0.7,
      originLane: 'CNSHA → SAJED',
      expectedCloseAt: new Date('2025-02-28'),
    },
  });
  console.log('  Created CRM data (contact, lead, deal)');

  // ─── Quote ────────────────────────────────────────────────────────────────

  const quote1 = await prisma.quote.create({
    data: {
      organizationId: acme.id,
      dealId: deal1.id,
      mode: FreightMode.FCL,
      originPortCode: 'CNSHA',
      destPortCode: 'SAJED',
      goodsType: GoodsType.ELECTRONICS,
      cargoValueMinor: 5000000, // $50,000
      currency: 'USD',
      totalMinor: 285000, // $2,850
      status: 'QUOTED',
      rateLockExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lineItems: {
        create: [
          {
            description: 'Base Ocean Freight (40FT FCL)',
            accountingCategory: 'COGS',
            amountMinor: 180000,
            currency: 'USD',
            sortOrder: 1,
          },
          {
            description: 'Bunker Adjustment Factor (BAF)',
            accountingCategory: 'COGS',
            amountMinor: 25000,
            currency: 'USD',
            sortOrder: 2,
          },
          {
            description: 'Origin THC',
            accountingCategory: 'COGS',
            amountMinor: 18000,
            currency: 'USD',
            sortOrder: 3,
          },
          {
            description: 'Destination THC',
            accountingCategory: 'COGS',
            amountMinor: 15000,
            currency: 'USD',
            sortOrder: 4,
          },
          {
            description: 'Inspection Fee',
            accountingCategory: 'OPEX',
            amountMinor: 20000,
            currency: 'USD',
            sortOrder: 5,
          },
          {
            description: 'Cargo Insurance',
            accountingCategory: 'OPEX',
            amountMinor: 7500,
            currency: 'USD',
            sortOrder: 6,
          },
          {
            description: 'Ronda Service Fee',
            accountingCategory: 'MARGIN',
            amountMinor: 19500,
            currency: 'USD',
            sortOrder: 7,
          },
        ],
      },
      cargos: {
        create: [
          {
            sku: 'ELEC-001',
            description: 'Smart TVs 55"',
            lengthCm: 140,
            widthCm: 90,
            heightCm: 20,
            weightKg: 25,
            qty: 100,
            hsCode: '8528.72',
            valueMinor: 3000000,
            currency: 'USD',
            goodsType: GoodsType.ELECTRONICS,
          },
          {
            sku: 'ELEC-002',
            description: 'Wireless Headphones',
            lengthCm: 30,
            widthCm: 20,
            heightCm: 15,
            weightKg: 1.2,
            qty: 500,
            hsCode: '8518.30',
            valueMinor: 2000000,
            currency: 'USD',
            goodsType: GoodsType.ELECTRONICS,
          },
        ],
      },
    },
  });

  const quote2 = await prisma.quote.create({
    data: {
      organizationId: globalTrade.id,
      mode: FreightMode.LCL,
      originPortCode: 'CNNGB',
      destPortCode: 'AEDXB',
      goodsType: GoodsType.TEXTILES,
      cargoValueMinor: 800000,
      currency: 'USD',
      totalMinor: 95000,
      status: 'DRAFT',
    },
  });
  console.log('  Created 2 quotes');

  // ─── Booking + Shipment ───────────────────────────────────────────────────

  const booking1 = await prisma.booking.create({
    data: {
      quoteId: quote1.id,
      organizationId: acme.id,
      incoterms: 'FOB',
      shipper: 'Shenzhen Electronics Factory',
      consignee: 'ACME Imports Ltd',
      notifyParty: 'ACME Imports Ltd',
      requestedEtd: new Date('2025-02-15'),
    },
  });

  const shipment1 = await prisma.shipment.create({
    data: {
      bookingId: booking1.id,
      organizationId: acme.id,
      status: ShipmentStatus.IN_TRANSIT,
      mode: FreightMode.FCL,
      originPortCode: 'CNSHA',
      destPortCode: 'SAJED',
      etd: new Date('2025-02-15'),
      eta: new Date('2025-03-09'),
      blNumber: 'MAEUSHAJ2500001',
      grossWeightKg: 3200,
      totalCbm: 28.5,
      containers: {
        create: [
          {
            containerType: 'FORTY_FT',
            containerNumber: 'MSKU1234567',
            sealNumber: 'SEAL001',
            grossWeightKg: 3200,
            cbm: 28.5,
          },
        ],
      },
      trackingEvents: {
        create: [
          {
            timestamp: new Date('2025-02-15T08:00:00Z'),
            status: ShipmentStatus.BOOKED,
            description: 'Booking confirmed with Maersk',
            source: 'SYSTEM',
          },
          {
            timestamp: new Date('2025-02-14T14:00:00Z'),
            status: ShipmentStatus.CARGO_RECEIVED,
            description: 'Cargo received at Shanghai port',
            locationLabel: 'Shanghai, China',
            locationLat: 31.23,
            locationLng: 121.47,
            source: 'MANUAL',
          },
          {
            timestamp: new Date('2025-02-15T06:00:00Z'),
            status: ShipmentStatus.STUFFED,
            description: 'Container stuffed and sealed',
            source: 'MANUAL',
          },
          {
            timestamp: new Date('2025-02-15T18:00:00Z'),
            status: ShipmentStatus.IN_TRANSIT,
            description: 'Vessel departed Shanghai (Vessel: MAERSK EDINBURGH, Voyage: ME2501)',
            locationLabel: 'Shanghai Port, China',
            source: 'CARRIER_API',
          },
        ],
      },
      milestones: {
        create: [
          { name: 'Booking Confirmed', completedAt: new Date('2025-02-10'), order: 1 },
          { name: 'Cargo Cut-off', dueAt: new Date('2025-02-14'), completedAt: new Date('2025-02-14'), order: 2 },
          { name: 'Vessel Departure', dueAt: new Date('2025-02-15'), completedAt: new Date('2025-02-15'), order: 3 },
          { name: 'Transhipment (Port Klang)', dueAt: new Date('2025-02-26'), order: 4 },
          { name: 'Vessel Arrival Jeddah', dueAt: new Date('2025-03-09'), order: 5 },
          { name: 'Customs Clearance', dueAt: new Date('2025-03-12'), order: 6 },
          { name: 'Delivery to Warehouse', dueAt: new Date('2025-03-14'), order: 7 },
        ],
      },
    },
  });

  // Inspection report
  await prisma.inspectionReport.create({
    data: {
      shipmentId: shipment1.id,
      supplierId: supplier1.id,
      scheduledAt: new Date('2025-02-10'),
      conductedAt: new Date('2025-02-10'),
      verdict: 'PASS',
      passedAll: true,
      notes: 'All items inspected. Packaging meets Amazon FBA requirements.',
      checkpoints: {
        create: [
          { name: 'Product Quality Check', passed: true, order: 1 },
          { name: 'Packaging Inspection', passed: true, order: 2 },
          { name: 'Quantity Verification', passed: true, notes: '100 TVs + 500 headphones confirmed', order: 3 },
          { name: 'FNSKU Label Scan', passed: true, order: 4 },
          { name: 'Carton Label Check', passed: true, order: 5 },
        ],
      },
    },
  });

  // Invoice
  const arAccount = await prisma.account.findUnique({ where: { code: '1200' } });
  const freightRevenueAccount = await prisma.account.findUnique({ where: { code: '4000' } });

  if (arAccount && freightRevenueAccount) {
    const invoice1 = await prisma.invoice.create({
      data: {
        organizationId: acme.id,
        shipmentId: shipment1.id,
        number: 'INV-2025-0001',
        status: 'ISSUED',
        currency: 'USD',
        subtotalMinor: 285000,
        taxMinor: 0,
        totalMinor: 285000,
        dueDate: new Date('2025-03-15'),
        issuedAt: new Date('2025-02-15'),
        lineItems: {
          create: [
            {
              accountId: freightRevenueAccount.id,
              description: 'FCL Freight Services - CNSHA to SAJED',
              accountingCategory: 'COGS',
              qty: 1,
              unitPriceMinor: 285000,
              totalMinor: 285000,
              currency: 'USD',
            },
          ],
        },
        ledgerEntries: {
          create: [
            {
              debitAccountId: arAccount.id,
              creditAccountId: freightRevenueAccount.id,
              amountMinor: 285000,
              currency: 'USD',
              description: 'Invoice INV-2025-0001 issued',
            },
          ],
        },
      },
    });
  }

  // Documents
  await prisma.document.createMany({
    data: [
      {
        organizationId: acme.id,
        shipmentId: shipment1.id,
        type: 'COMMERCIAL_INVOICE',
        status: 'APPROVED',
        version: 1,
        fileName: 'commercial_invoice_2025_0001.pdf',
        uploadedAt: new Date('2025-02-12'),
        approvedAt: new Date('2025-02-13'),
      },
      {
        organizationId: acme.id,
        shipmentId: shipment1.id,
        type: 'PACKING_LIST',
        status: 'APPROVED',
        version: 1,
        fileName: 'packing_list_2025_0001.pdf',
        uploadedAt: new Date('2025-02-12'),
        approvedAt: new Date('2025-02-13'),
      },
      {
        organizationId: acme.id,
        shipmentId: shipment1.id,
        type: 'BILL_OF_LADING',
        status: 'UPLOADED',
        version: 1,
        fileName: 'bl_MAEUSHAJ2500001.pdf',
        uploadedAt: new Date('2025-02-16'),
      },
      {
        organizationId: acme.id,
        shipmentId: shipment1.id,
        type: 'COO',
        status: 'REQUIRED',
        version: 1,
      },
    ],
  });

  console.log('  Created shipment, inspection, invoice, and documents');

  // ─── Settings ─────────────────────────────────────────────────────────────

  await prisma.setting.createMany({
    data: [
      { organizationId: acme.id, key: 'default_currency', value: 'USD', isPublic: true },
      { organizationId: acme.id, key: 'default_market', value: 'FBA_SA', isPublic: true },
      { organizationId: acme.id, key: 'notification_email', value: 'notifications@acme-imports.com', isPublic: false },
      { organizationId: globalTrade.id, key: 'default_currency', value: 'AED', isPublic: true },
      { organizationId: globalTrade.id, key: 'default_market', value: 'NOON_UAE', isPublic: true },
    ],
    skipDuplicates: true,
  });
  console.log('  Created settings');

  console.log('\n✅ Seed complete!');
  console.log('\n📧 Test credentials:');
  console.log('  Super Admin:  admin@ronda.ship          / Admin123!');
  console.log('  ACME Owner:   owner@acme-imports.com    / Owner123!');
  console.log('  ACME Booker:  logistics@acme-imports.com / Booker123!');
  console.log('  Sales Rep:    sales@ronda.ship           / Sales123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
