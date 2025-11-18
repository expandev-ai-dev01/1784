import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';
import type { UseVehicleListOptions, UseVehicleListReturn } from './types';

export const useVehicleList = (options: UseVehicleListOptions): UseVehicleListReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['vehicles', options.filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => vehicleService.list(options.filters),
    retry: 3,
    retryDelay: 2000,
  });

  const { data: filterOptions, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['vehicle-filter-options'],
    queryFn: () => vehicleService.getFilterOptions(),
    staleTime: 1000 * 60 * 10,
  });

  const { mutateAsync: getModelosByMarcas, isPending: isLoadingModelos } = useMutation({
    mutationFn: (marcas: string[]) => vehicleService.getModelosByMarcas(marcas),
  });

  return {
    vehicles: data?.veiculos || [],
    total: data?.total || 0,
    pagina: data?.pagina || 1,
    itensPorPagina: data?.itensPorPagina || 12,
    totalPaginas: data?.totalPaginas || 0,
    isLoading,
    error,
    refetch,
    filterOptions,
    isLoadingFilters,
    getModelosByMarcas,
    isLoadingModelos,
  };
};
