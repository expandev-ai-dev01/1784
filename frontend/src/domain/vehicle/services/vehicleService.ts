import { authenticatedClient } from '@/core/lib/api';
import type {
  Vehicle,
  VehicleListParams,
  VehicleListResponse,
  FilterOptions,
  ModelosByMarcasResponse,
  VehicleDetail,
} from '../types';

export const vehicleService = {
  async list(params: VehicleListParams): Promise<VehicleListResponse> {
    const response = await authenticatedClient.get('/vehicle', { params });
    return response.data.data;
  },

  async getFilterOptions(): Promise<FilterOptions> {
    const response = await authenticatedClient.get('/vehicle/filter-options');
    return response.data.data;
  },

  async getModelosByMarcas(marcas: string[]): Promise<ModelosByMarcasResponse> {
    const response = await authenticatedClient.get('/vehicle/modelos-by-marcas', {
      params: { marcas },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<VehicleDetail> {
    const response = await authenticatedClient.get(`/vehicle/${id}`);
    return response.data.data;
  },
};
