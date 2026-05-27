import type { CargoItemInput, ContainerType, PackingPlan, ContainerRecommendation } from '@ronda/types';

interface ContainerDimensions {
  internalL: number;
  internalW: number;
  internalH: number;
  maxPayloadKg: number;
  internalCbm: number;
}

const CONTAINER_DIMS: Record<string, ContainerDimensions> = {
  TWENTY_FT: { internalL: 589, internalW: 235, internalH: 239, maxPayloadKg: 21700, internalCbm: 33.2 },
  FORTY_FT: { internalL: 1203, internalW: 235, internalH: 239, maxPayloadKg: 26400, internalCbm: 67.7 },
  FORTY_FT_HC: { internalL: 1203, internalW: 235, internalH: 269, maxPayloadKg: 26300, internalCbm: 76.4 },
  REEFER_40FT: { internalL: 1134, internalW: 228, internalH: 199, maxPayloadKg: 27700, internalCbm: 51.3 },
};

export function calculateTotalCbm(items: CargoItemInput[]): number {
  return items.reduce((sum, item) => {
    const cbm = (item.lengthCm / 100) * (item.widthCm / 100) * (item.heightCm / 100) * item.qty;
    return sum + cbm;
  }, 0);
}

export function calculateTotalWeight(items: CargoItemInput[]): number {
  return items.reduce((sum, item) => sum + item.weightKg * item.qty, 0);
}

export function recommendContainer(items: CargoItemInput[]): ContainerRecommendation[] {
  const totalCbm = calculateTotalCbm(items);
  const totalWeight = calculateTotalWeight(items);

  const recommendations: ContainerRecommendation[] = [];

  // LCL option
  recommendations.push({
    type: 'LCL',
    utilizationPct: 100,
    totalCbm,
    recommended: totalCbm < 15,
  });

  // Container options
  for (const [type, dims] of Object.entries(CONTAINER_DIMS)) {
    const utilizationCbm = (totalCbm / dims.internalCbm) * 100;
    const utilizationWeight = (totalWeight / dims.maxPayloadKg) * 100;
    const utilization = Math.max(utilizationCbm, utilizationWeight);

    recommendations.push({
      type: type as ContainerType,
      utilizationPct: Math.min(utilization, 100),
      totalCbm,
      recommended: utilization <= 85 && utilization >= 50,
    });
  }

  // Sort: recommended first
  return recommendations.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
}

/**
 * Simple 3D bin packing using a greedy layer-by-layer approach.
 * This is a simplified version - production would use a more sophisticated algorithm.
 */
export function generatePackingPlan(
  items: CargoItemInput[],
  containerType: ContainerType,
): PackingPlan {
  const containerKey = containerType === '20FT' ? 'TWENTY_FT'
    : containerType === '40FT' ? 'FORTY_FT'
    : containerType === '40FT_HC' ? 'FORTY_FT_HC'
    : 'FORTY_FT';

  const dims = CONTAINER_DIMS[containerKey] ?? CONTAINER_DIMS['FORTY_FT']!;
  const warnings: string[] = [];

  // Expand items by quantity
  const expandedItems: Array<CargoItemInput & { index: number }> = [];
  for (const item of items) {
    for (let i = 0; i < item.qty; i++) {
      expandedItems.push({ ...item, index: expandedItems.length });
    }
  }

  // Sort by volume descending (largest first)
  expandedItems.sort(
    (a, b) =>
      b.lengthCm * b.widthCm * b.heightCm - a.lengthCm * a.widthCm * a.heightCm,
  );

  const placements: PackingPlan['placements'] = [];
  let currentX = 0;
  let currentY = 0;
  let currentZ = 0;
  let rowMaxHeight = 0;
  let layerMaxDepth = 0;

  const usedCbm = expandedItems.reduce(
    (sum, item) => sum + (item.lengthCm / 100) * (item.widthCm / 100) * (item.heightCm / 100),
    0,
  );

  for (const item of expandedItems) {
    // Try to place item; if width exceeded, new row; if height exceeded, new layer
    if (currentX + item.widthCm > dims.internalW) {
      currentX = 0;
      currentY += rowMaxHeight;
      rowMaxHeight = 0;
    }
    if (currentY + item.lengthCm > dims.internalL) {
      currentY = 0;
      currentX = 0;
      rowMaxHeight = 0;
      currentZ += layerMaxDepth;
      layerMaxDepth = 0;
    }
    if (currentZ + item.heightCm > dims.internalH) {
      warnings.push(`Item ${item.id ?? item.sku ?? 'unknown'} could not fit in container`);
      continue;
    }

    placements.push({
      itemId: item.id,
      x: currentX,
      y: currentY,
      z: currentZ,
      rotated: false,
    });

    currentX += item.widthCm;
    rowMaxHeight = Math.max(rowMaxHeight, item.lengthCm);
    layerMaxDepth = Math.max(layerMaxDepth, item.heightCm);
  }

  const utilizationPct = Math.min((usedCbm / dims.internalCbm) * 100, 100);
  const remainingSpaceCbm = Math.max(dims.internalCbm - usedCbm, 0);

  if (utilizationPct > 85) {
    warnings.push('Container utilization above 85% - review weight distribution');
  }

  // Check hazardous goods
  const hasHazmat = items.some((i) => i.goodsType === 'HAZARDOUS');
  if (hasHazmat) {
    warnings.push('Hazardous goods detected - ensure IMDG compliance and segregation rules');
  }

  return {
    containerType,
    placements,
    remainingSpaceCbm,
    warnings,
    utilizationPct,
  };
}
