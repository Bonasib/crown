import { checkCompliance, getRequiredDocuments } from '../compliance';

describe('checkCompliance', () => {
  it('passes when all required documents are present for FBA_SA', () => {
    const result = checkCompliance({
      market: 'FBA_SA',
      goodsType: 'GENERAL',
      uploadedDocuments: ['COMMERCIAL_INVOICE', 'PACKING_LIST', 'COO', 'BILL_OF_LADING'],
    });
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when documents are missing for FBA_SA', () => {
    const result = checkCompliance({
      market: 'FBA_SA',
      goodsType: 'GENERAL',
      uploadedDocuments: ['COMMERCIAL_INVOICE'],
    });
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('requires MSDS for hazardous goods', () => {
    const result = checkCompliance({
      goodsType: 'HAZARDOUS',
      uploadedDocuments: [],
    });
    const requiresMsds = result.requiredDocuments.includes('MSDS');
    const requiresDg = result.requiredDocuments.includes('DG_DECLARATION');
    expect(requiresMsds).toBe(true);
    expect(requiresDg).toBe(true);
    expect(result.passed).toBe(false);
  });

  it('returns warnings for non-blocking missing docs', () => {
    const result = checkCompliance({
      goodsType: 'FOOD',
      uploadedDocuments: [],
    });
    // PHYTOSANITARY is non-blocking for FOOD
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('getRequiredDocuments', () => {
  it('returns FBA_SA required docs', () => {
    const docs = getRequiredDocuments('FBA_SA');
    expect(docs).toContain('COMMERCIAL_INVOICE');
    expect(docs).toContain('PACKING_LIST');
    expect(docs).toContain('COO');
    expect(docs).toContain('BILL_OF_LADING');
  });

  it('returns FBA_US required docs', () => {
    const docs = getRequiredDocuments('FBA_US');
    expect(docs).toContain('COMMERCIAL_INVOICE');
    expect(docs).toContain('BILL_OF_LADING');
  });
});
