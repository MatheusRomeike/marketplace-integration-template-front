import { Tenant } from './tenant';

export interface AuthenticatedUser {
  name: string;
  email: string;
  tenant?: Tenant;
}

