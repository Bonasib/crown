const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

export async function trpc<T>(
  procedure: string,
  input?: unknown,
  token?: string,
  orgId?: string,
): Promise<T> {
  const isQuery = !procedure.includes('.');
  const method = typeof input === 'undefined' ? 'GET' : 'POST';

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (orgId) headers['x-org-id'] = orgId;

  const url = `${API_URL}/trpc/${procedure}${method === 'GET' ? `?input=${encodeURIComponent(JSON.stringify({ json: input ?? {} }))}` : ''}`;

  const res = await fetch(url, {
    method,
    headers,
    ...(method === 'POST' ? { body: JSON.stringify({ json: input }) } : {}),
    cache: 'no-store',
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message ?? 'API error');
  return data.result?.data?.json as T;
}
