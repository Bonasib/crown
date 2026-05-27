import * as React from 'react';
import { Badge, type BadgeProps } from './badge';

type ShipmentStatus =
  | 'DRAFT' | 'QUOTED' | 'BOOKED' | 'CARGO_RECEIVED' | 'INSPECTED'
  | 'STUFFED' | 'CUSTOMS_EXPORT' | 'IN_TRANSIT' | 'TRANSHIPMENT'
  | 'CUSTOMS_IMPORT' | 'ARRIVED' | 'DELIVERED' | 'CLOSED'
  | 'ON_HOLD' | 'CANCELLED' | 'EXCEPTION';

const STATUS_CONFIG: Record<ShipmentStatus, { label: string; variant: BadgeProps['variant'] }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  QUOTED: { label: 'Quoted', variant: 'info' },
  BOOKED: { label: 'Booked', variant: 'info' },
  CARGO_RECEIVED: { label: 'Cargo Received', variant: 'info' },
  INSPECTED: { label: 'Inspected', variant: 'success' },
  STUFFED: { label: 'Stuffed', variant: 'info' },
  CUSTOMS_EXPORT: { label: 'Export Customs', variant: 'warning' },
  IN_TRANSIT: { label: 'In Transit', variant: 'default' },
  TRANSHIPMENT: { label: 'Transhipment', variant: 'warning' },
  CUSTOMS_IMPORT: { label: 'Import Customs', variant: 'warning' },
  ARRIVED: { label: 'Arrived', variant: 'success' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'secondary' },
  ON_HOLD: { label: 'On Hold', variant: 'warning' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  EXCEPTION: { label: 'Exception', variant: 'destructive' },
};

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

export function ShipmentStatusBadge({ status, className }: ShipmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'secondary' as const };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
