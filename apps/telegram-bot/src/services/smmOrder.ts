import { shopPrisma, type SmmService } from '@ronda/shop-db';
import { addSmmOrder, getSmmOrderStatus } from '@ronda/shop-core';

export async function placeSmmOrder(service: SmmService, link: string, quantity: number): Promise<string> {
  const provider = await shopPrisma.smmProvider.findUnique({ where: { id: service.providerId } });
  if (!provider || !provider.isActive) throw new Error('SMM provider not configured or inactive');

  const result = await addSmmOrder(
    { baseUrl: provider.baseUrl, apiKey: provider.apiKey },
    { service: service.providerServiceId, link, quantity }
  );
  return String(result.order);
}

export async function fetchSmmOrderStatus(providerId: string, providerOrderId: string): Promise<string> {
  const provider = await shopPrisma.smmProvider.findUnique({ where: { id: providerId } });
  if (!provider) return 'UNKNOWN';
  const status = await getSmmOrderStatus({ baseUrl: provider.baseUrl, apiKey: provider.apiKey }, providerOrderId);
  return status.status;
}
