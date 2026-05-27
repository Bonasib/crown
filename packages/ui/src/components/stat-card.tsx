import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              'mt-1 text-xs',
              trend.positive !== false ? 'text-green-600' : 'text-red-600',
            )}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
