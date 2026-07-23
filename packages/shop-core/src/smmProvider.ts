/**
 * Generic client for the de-facto "JAP-standard" SMM panel API that the vast
 * majority of SMM providers (SMM panels for likes/views/followers/etc.) expose:
 * a single POST endpoint at `${baseUrl}` accepting `key` + `action` form fields.
 * Point `baseUrl`/`apiKey` at whichever provider the admin configures.
 */
export interface SmmProviderConfig {
  baseUrl: string;
  apiKey: string;
}

export interface SmmServiceListItem {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

export interface SmmAddOrderResult {
  order: number;
}

export interface SmmOrderStatus {
  charge: string;
  start_count: string;
  status: string;
  remains: string;
  currency: string;
}

async function post<T>(config: SmmProviderConfig, params: Record<string, string | number>): Promise<T> {
  const body = new URLSearchParams({ key: config.apiKey, ...toStringRecord(params) });
  const res = await fetch(config.baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    throw new Error(`SMM provider request failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as T | { error: string };
  if (json && typeof json === 'object' && 'error' in json) {
    throw new Error(`SMM provider error: ${(json as { error: string }).error}`);
  }
  return json as T;
}

function toStringRecord(params: Record<string, string | number>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) out[k] = String(v);
  return out;
}

export async function listSmmServices(config: SmmProviderConfig): Promise<SmmServiceListItem[]> {
  return post<SmmServiceListItem[]>(config, { action: 'services' });
}

export async function addSmmOrder(
  config: SmmProviderConfig,
  input: { service: string; link: string; quantity: number }
): Promise<SmmAddOrderResult> {
  return post<SmmAddOrderResult>(config, {
    action: 'add',
    service: input.service,
    link: input.link,
    quantity: input.quantity,
  });
}

export async function getSmmOrderStatus(config: SmmProviderConfig, orderId: string | number): Promise<SmmOrderStatus> {
  return post<SmmOrderStatus>(config, { action: 'status', order: orderId });
}

export async function getSmmBalance(config: SmmProviderConfig): Promise<{ balance: string; currency: string }> {
  return post(config, { action: 'balance' });
}
