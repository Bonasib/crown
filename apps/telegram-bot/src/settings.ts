import { shopPrisma } from '@ronda/shop-db';
import type { Lang } from '@ronda/shop-core';

const TTL_MS = 30_000;
let cache: { at: number; values: Record<string, string> } | null = null;

async function loadAll(): Promise<Record<string, string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.values;
  const rows = await shopPrisma.shopSetting.findMany();
  const values: Record<string, string> = {};
  for (const row of rows) values[row.key] = row.value;
  cache = { at: Date.now(), values };
  return values;
}

export function invalidateSettingsCache(): void {
  cache = null;
}

export async function getSetting(key: string, fallback = ''): Promise<string> {
  const values = await loadAll();
  return values[key] ?? fallback;
}

export async function getNumberSetting(key: string, fallback: number): Promise<number> {
  const raw = await getSetting(key);
  const n = Number(raw);
  return Number.isFinite(n) && raw !== '' ? n : fallback;
}

export async function getGlobalProfitPercent(): Promise<number> {
  return getNumberSetting('global_profit_percent', 20);
}

export async function getStarsPerUsd(): Promise<number> {
  return getNumberSetting('stars_per_usd', 50);
}

export async function getDefaultLanguage(): Promise<Lang> {
  const v = await getSetting('default_language', 'ar');
  return v === 'en' ? 'en' : 'ar';
}

export async function getSupportUsername(): Promise<string> {
  return getSetting('support_username', 'digyourownwhole');
}

export async function getG2aConfig(): Promise<{ baseUrl: string; apiKey: string; apiSecret: string }> {
  const [baseUrl, apiKey, apiSecret] = await Promise.all([
    getSetting('g2a_base_url', 'https://api.g2a.com'),
    getSetting('g2a_client_id', ''),
    getSetting('g2a_api_key', ''),
  ]);
  return { baseUrl, apiKey, apiSecret };
}
