import type {
  Market,
  GoodsType,
  DocumentType,
  ComplianceCheckResult,
  ComplianceRequirement,
} from '@ronda/types';

// Built-in compliance rules (also stored in DB)
const BUILT_IN_RULES: ComplianceRequirement[] = [
  // FBA Saudi Arabia
  {
    id: 'fba_sa_ci',
    market: 'FBA_SA',
    documentType: 'COMMERCIAL_INVOICE',
    description: 'Commercial Invoice required for Saudi Customs',
    isBlocking: true,
  },
  {
    id: 'fba_sa_pl',
    market: 'FBA_SA',
    documentType: 'PACKING_LIST',
    description: 'Packing List required for FBA Saudi Arabia',
    isBlocking: true,
  },
  {
    id: 'fba_sa_coo',
    market: 'FBA_SA',
    documentType: 'COO',
    description: 'Certificate of Origin required for Saudi Arabia (SABER compliance)',
    isBlocking: true,
  },
  {
    id: 'fba_sa_bl',
    market: 'FBA_SA',
    documentType: 'BILL_OF_LADING',
    description: 'Bill of Lading required for customs clearance',
    isBlocking: true,
  },
  // FBA UAE
  {
    id: 'fba_uae_ci',
    market: 'NOON_UAE',
    documentType: 'COMMERCIAL_INVOICE',
    description: 'Commercial Invoice required for UAE Customs',
    isBlocking: true,
  },
  {
    id: 'fba_uae_coo',
    market: 'NOON_UAE',
    documentType: 'COO',
    description: 'Certificate of Origin required for UAE',
    isBlocking: false,
  },
  // FBA US
  {
    id: 'fba_us_ci',
    market: 'FBA_US',
    documentType: 'COMMERCIAL_INVOICE',
    description: 'Commercial Invoice required for US Customs (CBP)',
    isBlocking: true,
  },
  {
    id: 'fba_us_bl',
    market: 'FBA_US',
    documentType: 'BILL_OF_LADING',
    description: 'Bill of Lading required for US import',
    isBlocking: true,
  },
  {
    id: 'fba_us_pl',
    market: 'FBA_US',
    documentType: 'PACKING_LIST',
    description: 'Packing List required for FBA US',
    isBlocking: true,
  },
  // Goods-type based
  {
    id: 'hazmat_msds',
    documentType: 'MSDS',
    description: 'Material Safety Data Sheet required for hazardous goods',
    isBlocking: true,
    goodsType: 'HAZARDOUS',
  },
  {
    id: 'hazmat_dg',
    documentType: 'DG_DECLARATION',
    description: 'Dangerous Goods Declaration (IMDG) required',
    isBlocking: true,
    goodsType: 'HAZARDOUS',
  },
  {
    id: 'food_phyto',
    documentType: 'PHYTOSANITARY',
    description: 'Phytosanitary certificate may be required for food/agricultural items',
    isBlocking: false,
    goodsType: 'FOOD',
  },
  {
    id: 'agri_phyto',
    documentType: 'PHYTOSANITARY',
    description: 'Phytosanitary certificate required for agricultural goods',
    isBlocking: true,
    goodsType: 'AGRICULTURAL',
  },
];

export interface CheckComplianceInput {
  market?: Market;
  goodsType?: GoodsType;
  uploadedDocuments: DocumentType[];
  additionalRules?: ComplianceRequirement[];
}

export function checkCompliance(input: CheckComplianceInput): ComplianceCheckResult {
  const { market, goodsType, uploadedDocuments, additionalRules = [] } = input;

  const allRules = [...BUILT_IN_RULES, ...additionalRules];

  // Filter applicable rules
  const applicableRules = allRules.filter((rule) => {
    const marketMatch = !rule.market || rule.market === market;
    const goodsMatch = !rule.goodsType || rule.goodsType === goodsType;
    return marketMatch && goodsMatch;
  });

  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredDocuments = new Set<DocumentType>();

  for (const rule of applicableRules) {
    requiredDocuments.add(rule.documentType);
    const hasDoc = uploadedDocuments.includes(rule.documentType);

    if (!hasDoc) {
      if (rule.isBlocking) {
        errors.push(`MISSING [BLOCKING]: ${rule.description} (${rule.documentType})`);
      } else {
        warnings.push(`MISSING [WARNING]: ${rule.description} (${rule.documentType})`);
      }
    }
  }

  return {
    market: market ?? ('FBA_SA' as Market),
    passed: errors.length === 0,
    errors,
    warnings,
    requiredDocuments: Array.from(requiredDocuments),
  };
}

export function getRequiredDocuments(market: Market, goodsType?: GoodsType): DocumentType[] {
  return Array.from(
    new Set(
      BUILT_IN_RULES.filter(
        (r) => (!r.market || r.market === market) && (!r.goodsType || r.goodsType === goodsType),
      ).map((r) => r.documentType),
    ),
  );
}
