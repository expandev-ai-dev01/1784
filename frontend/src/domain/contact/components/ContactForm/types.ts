import type { VehicleDetail } from '@/domain/vehicle/types';

export interface ContactFormProps {
  vehicle: VehicleDetail;
  onSuccess?: () => void;
}
