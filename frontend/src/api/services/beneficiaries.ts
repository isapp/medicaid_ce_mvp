import { getAPIClient } from '../client';

export interface Beneficiary {
  id: string;
  tenantId: string;
  medicaidId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  engagementStatus: 'active' | 'non_compliant' | 'exempt' | 'unknown';
  createdAt: string;
  updatedAt: string;
}

export interface BeneficiariesListResponse {
  items: Beneficiary[];
  page: number;
  pageSize: number;
  total: number;
}

export interface BeneficiariesListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'active' | 'non_compliant' | 'exempt' | 'unknown';
}

export const beneficiariesService = {
  list: async (params?: BeneficiariesListParams): Promise<BeneficiariesListResponse> => {
    const apiClient = getAPIClient();
    return apiClient.get<BeneficiariesListResponse>('/beneficiaries', params);
  },

  getById: async (id: string): Promise<Beneficiary> => {
    const apiClient = getAPIClient();
    return apiClient.get<Beneficiary>(`/beneficiaries/${id}`);
  },

  create: async (data: Omit<Beneficiary, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Beneficiary> => {
    const apiClient = getAPIClient();
    return apiClient.post<Beneficiary>('/beneficiaries', data);
  },
};
