import { Router } from 'express';
import * as vehicleController from '@/api/v1/internal/vehicle/controller';
import * as vehicleDetailController from '@/api/v1/internal/vehicle/detail/controller';

const router = Router();

router.get('/vehicle', vehicleController.listHandler);
router.get('/vehicle/filter-options', vehicleController.filterOptionsHandler);
router.get('/vehicle/modelos-by-marcas', vehicleController.modelosByMarcasHandler);
router.get('/vehicle/:id', vehicleDetailController.getHandler);

export default router;
