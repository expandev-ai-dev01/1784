import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/middleware';
import { HTTP_STATUS } from '@/constants';
import { vehicleGet } from '@/services/vehicle';

/**
 * @api {get} /internal/vehicle/:id Get Vehicle Details
 * @apiName GetVehicleDetails
 * @apiGroup Vehicle
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information about a specific vehicle
 *
 * @apiParam {Number} id Vehicle identifier
 *
 * @apiSuccess {Object} data Vehicle details
 * @apiSuccess {Number} data.id Vehicle identifier
 * @apiSuccess {String} data.modelo Vehicle model
 * @apiSuccess {String} data.marca Vehicle brand
 * @apiSuccess {Number} data.ano Vehicle year
 * @apiSuccess {Number} data.preco Vehicle price
 * @apiSuccess {String} data.imagemPrincipal Main image URL
 * @apiSuccess {Number} data.quilometragem Vehicle mileage
 * @apiSuccess {String} data.cambio Transmission type
 * @apiSuccess {String} data.status Vehicle status
 * @apiSuccess {Object[]} data.fotos Photo gallery
 * @apiSuccess {Object} data.especificacoes Technical specifications
 * @apiSuccess {Object[]} data.itensSerie Standard items
 * @apiSuccess {Object[]} data.opcionais Optional items
 * @apiSuccess {Object} data.historico Vehicle history
 * @apiSuccess {Object} data.condicoesVenda Sale conditions
 * @apiSuccess {Object[]} data.veiculosSimilares Similar vehicles
 *
 * @apiError {String} NotFoundError Vehicle not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  try {
    /**
     * @validation Validate route parameters
     * @throw {ValidationError}
     */
    const validated = paramsSchema.parse(req.params);

    /**
     * @rule {fn-vehicle-detail} Retrieve complete vehicle details
     */
    const data = await vehicleGet(validated.id);

    if (!data) {
      res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse('vehicleNotFound', 'NOT_FOUND'));
      return;
    }

    res.json(successResponse(data));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('invalidParameters', 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}
