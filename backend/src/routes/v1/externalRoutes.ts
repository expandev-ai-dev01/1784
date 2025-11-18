import { Router } from 'express';
import * as contactController from '@/api/v1/external/contact/controller';

const router = Router();

router.post('/contact', contactController.postHandler);

export default router;
