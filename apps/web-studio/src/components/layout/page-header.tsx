import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden border-b border-border', className)}>
      <div className="grid-fade absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="container relative py-14 md:py-20">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
