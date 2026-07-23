import { createHash } from 'crypto';

/**
 * Best-effort client for G2A's Integration API, used only for opportunistic
 * price/stock lookups on products the admin has already added manually.
 * G2A's API is seller/listing-oriented, not a generic "buy and resell"
 * endpoint, so it is never on the critical path for checkout — if a call
 * fails or credentials are missing, the admin-entered price/stock is used.
 *
 * IMPORTANT: G2A's exact auth header format changes between API versions.
 * `buildAuthHeader` below follows their commonly documented
 * `Authorization: <apiKey>, <hash>` pattern with a SHA-256 hash of
 * `apiKey + apiSecret + timestamp`. Verify this against the current G2A
 * Integration API docs for your account before relying on it in production.
 */
export interface G2aConfig {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

function buildAuthHeader(config: G2aConfig, timestamp: string): string {
  const hash = createHash('sha256').update(config.apiKey + config.apiSecret + timestamp).digest('hex');
  return `${config.apiKey}, ${hash}`;
}

export interface G2aProductInfo {
  id: string;
  name?: string;
  priceMinor?: number;
  currency?: string;
  inStock?: boolean;
}

export async function lookupG2aProduct(config: G2aConfig, productId: string): Promise<G2aProductInfo | null> {
  if (!config.apiKey || !config.apiSecret) return null;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  try {
    const res = await fetch(`${config.baseUrl.replace(/\/$/, '')}/v1/products/${encodeURIComponent(productId)}`, {
      headers: {
        Authorization: buildAuthHeader(config, timestamp),
        'X-Timestamp': timestamp,
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      id: string;
      name?: string;
      price?: { amount?: number; currency?: string };
      stock_amount?: number;
    };
    return {
      id: json.id,
      name: json.name,
      priceMinor: json.price?.amount != null ? Math.round(json.price.amount * 100) : undefined,
      currency: json.price?.currency,
      inStock: json.stock_amount == null ? undefined : json.stock_amount > 0,
    };
  } catch {
    return null;
  }
}
