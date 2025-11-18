import type { VehicleListParams, FilterOptions } from '../../types';

export interface VehicleFiltersProps {
  filterOptions?: FilterOptions;
  onFilterChange: (filters: VehicleListParams) => void;
  initialFilters?: VehicleListParams;
  isLoadingFilters: boolean;
  onGetModelosByMarcas: (marcas: string[]) => Promise<{ modelos: string[] }>;
}
