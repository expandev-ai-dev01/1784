export type {
  Vehicle,
  VehicleListParams,
  VehicleListResponse,
  FilterOptions,
  ModelosByMarcasResponse,
  VehicleDetail,
  VehiclePhoto,
  VehicleSpecifications,
  VehicleItem,
  VehicleHistory,
  SaleConditions,
} from './types';

export { vehicleService } from './services';

export {
  useVehicleList,
  type UseVehicleListOptions,
  type UseVehicleListReturn,
  useVehicleDetail,
  type UseVehicleDetailOptions,
  type UseVehicleDetailReturn,
} from './hooks';

export {
  VehicleCard,
  VehicleFilters,
  VehicleSort,
  VehiclePagination,
  type VehicleCardProps,
  type VehicleFiltersProps,
  type VehicleSortProps,
  type VehiclePaginationProps,
} from './components';
