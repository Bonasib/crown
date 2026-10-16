import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Persona' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
