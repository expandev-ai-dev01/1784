import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';
import type { UseVehicleDetailOptions, UseVehicleDetailReturn } from './types';

export const useVehicleDetail = (options: UseVehicleDetailOptions): UseVehicleDetailReturn => {
  const queryKey = ['vehicle-detail', options.id];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => vehicleService.getById(options.id),
    retry: 3,
    retryDelay: 2000,
    enabled: !!options.id,
  });

  return {
    vehicle: data || null,
    isLoading,
    error,
    refetch,
  };
};
