import type { VehicleListParams, Vehicle, FilterOptions } from '../../types';

export interface UseVehicleListOptions {
  filters: VehicleListParams;
}

export interface UseVehicleListReturn {
  vehicles: Vehicle[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  filterOptions?: FilterOptions;
  isLoadingFilters: boolean;
  getModelosByMarcas: (marcas: string[]) => Promise<{ modelos: string[] }>;
  isLoadingModelos: boolean;
}
