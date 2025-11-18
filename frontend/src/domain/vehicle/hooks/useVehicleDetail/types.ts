import type { VehicleDetail } from '../../types';

export interface UseVehicleDetailOptions {
  id: string;
}

export interface UseVehicleDetailReturn {
  vehicle: VehicleDetail | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
