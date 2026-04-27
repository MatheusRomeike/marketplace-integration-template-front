import { Provider } from '../../features/integrations/models/integration.model';

export interface MarketplaceMapping {
  integrationType: Provider;
  externalId: string;
  externalName?: string | null;
}
