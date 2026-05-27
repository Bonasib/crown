/**
 * Theme definitions for each Ronda Ship application.
 * Each theme is a set of CSS custom property values injected at <html> level.
 */

export type AppTheme = 'saas' | 'erp' | 'crm' | 'admin';

export interface ThemeTokens {
  /** HSL value for --primary (e.g. "175 84% 32%") */
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  ring: string;
  sidebarBackground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
}

/**
 * web-saas (Customer Portal) — Teal theme
 * Primary: #0D9488 (teal-600), Accent: amber
 */
export const saasTheme: ThemeTokens = {
  primary: '175 84% 32%',           // #0D9488 teal-600
  primaryForeground: '0 0% 100%',
  accent: '43 96% 56%',             // amber
  accentForeground: '26 83% 14%',
  background: '0 0% 100%',          // clean white
  foreground: '222 84% 5%',
  ring: '175 84% 32%',
  sidebarBackground: '174 100% 96%',  // teal-50
  sidebarPrimary: '175 84% 32%',
  sidebarPrimaryForeground: '0 0% 100%',
};

/**
 * web-erp (Operations/Finance) — Steel Navy theme
 * Primary: #1E3A5F (navy), Background: slate-50, Accent: cyan
 */
export const erpTheme: ThemeTokens = {
  primary: '214 52% 24%',           // #1E3A5F navy
  primaryForeground: '0 0% 100%',
  accent: '186 100% 42%',           // cyan
  accentForeground: '186 100% 10%',
  background: '210 20% 98%',        // slate-50
  foreground: '215 25% 15%',
  ring: '214 52% 24%',
  sidebarBackground: '214 52% 16%',   // dark navy
  sidebarPrimary: '186 100% 42%',
  sidebarPrimaryForeground: '186 100% 10%',
};

/**
 * web-crm (Sales/CRM) — Amber/Coral theme
 * Primary: #D97706 (amber-600), Background: warm white, Accent: rose
 */
export const crmTheme: ThemeTokens = {
  primary: '38 92% 50%',            // #D97706 amber-600
  primaryForeground: '0 0% 100%',
  accent: '347 77% 50%',            // rose
  accentForeground: '0 0% 100%',
  background: '36 33% 99%',         // warm white
  foreground: '24 10% 10%',
  ring: '38 92% 50%',
  sidebarBackground: '36 33% 97%',
  sidebarPrimary: '38 92% 50%',
  sidebarPrimaryForeground: '0 0% 100%',
};

/**
 * web-admin (Admin Dashboard) — Deep Purple theme
 * Primary: #4C1D95 (violet-900), Background: neutral-50, Accent: violet
 */
export const adminTheme: ThemeTokens = {
  primary: '263 80% 35%',           // #4C1D95 violet-900
  primaryForeground: '0 0% 100%',
  accent: '263 70% 60%',            // violet
  accentForeground: '0 0% 100%',
  background: '0 0% 98%',           // neutral-50
  foreground: '0 0% 9%',
  ring: '263 80% 35%',
  sidebarBackground: '263 80% 20%',   // deep purple
  sidebarPrimary: '263 70% 60%',
  sidebarPrimaryForeground: '0 0% 100%',
};

export const themes: Record<AppTheme, ThemeTokens> = {
  saas: saasTheme,
  erp: erpTheme,
  crm: crmTheme,
  admin: adminTheme,
};

/**
 * Generates a <style> tag content that sets CSS custom properties at :root.
 * Call this in each app's root layout to apply the correct theme.
 */
export function generateThemeCSS(theme: ThemeTokens): string {
  return `
    :root {
      --primary: ${theme.primary};
      --primary-foreground: ${theme.primaryForeground};
      --accent: ${theme.accent};
      --accent-foreground: ${theme.accentForeground};
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --ring: ${theme.ring};
      --sidebar-background: ${theme.sidebarBackground};
      --sidebar-primary: ${theme.sidebarPrimary};
      --sidebar-primary-foreground: ${theme.sidebarPrimaryForeground};
    }
  `.trim();
}
