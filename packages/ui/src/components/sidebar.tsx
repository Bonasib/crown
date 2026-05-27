'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Separator } from './separator';

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue>({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);
  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return React.useContext(SidebarContext);
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isOpen } = useSidebar();
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200',
        isOpen ? 'w-64' : 'w-16',
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex-1 overflow-y-auto py-4', className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-t border-sidebar-border p-4', className)}>{children}</div>
  );
}

export function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        'px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 transition-opacity',
        isOpen ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-0.5 px-2">{children}</div>;
}

export interface SidebarMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarMenuItem({ icon, label, isActive, onClick }: SidebarMenuItemProps) {
  const { isOpen } = useSidebar();
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {isOpen && <span className="truncate">{label}</span>}
    </button>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <Button variant="ghost" size="icon" className={cn('h-8 w-8', className)} onClick={toggle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </Button>
  );
}

export { Separator };
