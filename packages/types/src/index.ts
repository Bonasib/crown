// ─── Enums ────────────────────────────────────────────────────────────────────

export type AccountingCategory = 'COGS' | 'OPEX' | 'DUTY_VAT' | 'MARGIN';
export type FreightMode = 'LCL' | 'FCL' | 'AIR' | 'MULTIMODAL' | 'RAIL';
export type ShipmentStatus =
  | 'DRAFT' | 'QUOTED' | 'BOOKED' | 'CARGO_RECEIVED' | 'INSPECTED'
  | 'STUFFED' | 'CUSTOMS_EXPORT' | 'IN_TRANSIT' | 'TRANSHIPMENT'
  | 'CUSTOMS_IMPORT' | 'ARRIVED' | 'DELIVERED' | 'CLOSED'
  | 'ON_HOLD' | 'CANCELLED' | 'EXCEPTION';
export type ContainerType = '20FT' | '40FT' | '40FT_HC' | 'REEFER_40FT' | 'FLAT_RACK_40FT' | 'OPEN_TOP_20FT';
export type GoodsType =
  | 'GENERAL' | 'HAZARDOUS' | 'PERISHABLE' | 'FRAGILE_HIGH_VALUE'
  | 'AUTOMOTIVE' | 'TEXTILES' | 'MACHINERY' | 'ELECTRONICS' | 'FOOD'
  | 'CHEMICALS' | 'FURNITURE' | 'COSMETICS' | 'MEDICAL_PHARMA'
  | 'CONSTRUCTION' | 'AGRICULTURAL' | 'ENERGY_SOLAR';
export type UserRole =
  | 'SUPER_ADMIN' | 'OPS_MANAGER' | 'OPS_AGENT' | 'FINANCE' | 'SALES_REP'
  | 'SALES_MANAGER' | 'INSPECTOR' | 'SUPPORT' | 'READ_ONLY_AUDITOR'
  | 'ORG_OWNER' | 'ORG_ADMIN' | 'BOOKER' | 'VIEWER' | 'ACCOUNTANT'
  | 'IMPORTER' | 'WAREHOUSE_OPERATOR';

export type AccountType = 'IMPORTER' | 'WAREHOUSE_OPERATOR';
export type OtpChannel = 'WHATSAPP' | 'SMS';
export type BarcodeType = 'PRODUCT' | 'CARTON';
export type OutboxStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
export type InvoiceAction = 'APPROVED' | 'DECLINED' | 'REVISION_REQUESTED';
export type InspectionStage = 'FACTORY' | 'PRODUCTION' | 'QC' | 'PACKAGING' | 'LOADING' | 'SEAL';
export type DealStage = 'NEW' | 'QUALIFIED' | 'QUOTED' | 'NEGOTIATION' | 'WON' | 'LOST';
export type Market = 'FBA_US' | 'FBA_EU' | 'FBA_UK' | 'FBA_SA' | 'NOON_SA' | 'NOON_UAE' | 'NOON_EG';
export type DocumentType =
  | 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'BILL_OF_LADING' | 'COO'
  | 'INSPECTION_REPORT' | 'MSDS' | 'DG_DECLARATION' | 'PHYTOSANITARY'
  | 'FNSKU_LABEL' | 'CARTON_LABEL' | 'PALLET_LABEL';

// ─── Money ─────────────────────────────────────────────────────────────────────
export interface Money {
  /** Integer minor units (cents/halalas) */
  amount: number;
  currency: string;
}

// ─── Quote ─────────────────────────────────────────────────────────────────────
export interface QuoteLineItem {
  id: string;
  description: string;
  accountingCategory: AccountingCategory;
  amount: Money;
  rate?: number;
  base?: Money;
}

export interface QuoteBreakdown {
  baseFreight: QuoteLineItem;
  originCharges: QuoteLineItem[];
  destinationHandling: QuoteLineItem;
  cargoInsurance: QuoteLineItem;
  inspectionFee: QuoteLineItem;
  surcharges: QuoteLineItem[];
  dutiesVat: QuoteLineItem[];
  total: Money;
  totalCogs: Money;
  totalOpex: Money;
  totalDutyVat: Money;
  currency: string;
}

// ─── Container ─────────────────────────────────────────────────────────────────
export interface ContainerSpec {
  type: ContainerType;
  internalCbm: number;
  maxPayloadKg: number;
  tare: number;
  surchargePct: number;
}

export interface ContainerRecommendation {
  type: ContainerType | 'LCL';
  utilizationPct: number;
  totalCbm: number;
  recommended: boolean;
}

// ─── Packing ───────────────────────────────────────────────────────────────────
export interface CargoItemInput {
  id: string;
  sku?: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  qty: number;
  hsCode?: string;
  value: Money;
  goodsType: GoodsType;
}

export interface PackingPlacement {
  itemId: string;
  x: number;
  y: number;
  z: number;
  rotated: boolean;
}

export interface PackingPlan {
  containerType: ContainerType;
  placements: PackingPlacement[];
  remainingSpaceCbm: number;
  warnings: string[];
  utilizationPct: number;
}

// ─── Compliance ────────────────────────────────────────────────────────────────
export interface ComplianceRequirement {
  id: string;
  market: Market;
  goodsType?: GoodsType;
  documentType: DocumentType;
  description: string;
  isBlocking: boolean;
  rule?: string;
}

export interface ComplianceCheckResult {
  market: Market;
  passed: boolean;
  errors: string[];
  warnings: string[];
  requiredDocuments: DocumentType[];
}

// ─── Tracking ──────────────────────────────────────────────────────────────────
export interface TrackingEvent {
  id: string;
  shipmentId: string;
  timestamp: Date;
  location?: { lat: number; lng: number; label: string };
  status: ShipmentStatus;
  description: string;
  source: 'MANUAL' | 'CARRIER_API' | 'SYSTEM';
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface JwtPayload {
  sub: string;
  email: string;
  orgId: string | null;
  roles: UserRole[];
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── API Responses ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
