import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/middleware';
import { HTTP_STATUS } from '@/constants';
import { vehicleList, getFilterOptions, getModelosByMarcas } from '@/services/vehicle';

/**
 * @api {get} /internal/vehicle List Vehicles
 * @apiName ListVehicles
 * @apiGroup Vehicle
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists vehicles with filtering, sorting, and pagination
 *
 * @apiParam {String[]} [marcas] Filter by brands
 * @apiParam {String[]} [modelos] Filter by models
 * @apiParam {Number} [anoMin] Minimum year filter
 * @apiParam {Number} [anoMax] Maximum year filter
 * @apiParam {Number} [precoMin] Minimum price filter
 * @apiParam {Number} [precoMax] Maximum price filter
 * @apiParam {String[]} [cambios] Filter by transmission types
 * @apiParam {String} [ordenacao] Sort criteria
 * @apiParam {Number} [pagina] Current page number (default: 1)
 * @apiParam {Number} [itensPorPagina] Items per page (default: 12)
 *
 * @apiSuccess {Object} data Response data
 * @apiSuccess {Object[]} data.veiculos Array of vehicles
 * @apiSuccess {Number} data.total Total number of vehicles
 * @apiSuccess {Number} data.pagina Current page
 * @apiSuccess {Number} data.itensPorPagina Items per page
 * @apiSuccess {Number} data.totalPaginas Total pages
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const querySchema = z.object({
    marcas: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
    modelos: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
    anoMin: z.coerce.number().int().positive().optional(),
    anoMax: z.coerce.number().int().positive().optional(),
    precoMin: z.coerce.number().positive().optional(),
    precoMax: z.coerce.number().positive().optional(),
    cambios: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
    ordenacao: z.string().optional(),
    pagina: z.coerce.number().int().positive().default(1),
    itensPorPagina: z.coerce.number().int().positive().default(12),
  });

  try {
    /**
     * @validation Validate query parameters
     * @throw {ValidationError}
     */
    const validated = querySchema.parse(req.query);

    /**
     * @validation Validate year range consistency
     * @throw {ValidationError}
     */
    if (
      validated.anoMin !== undefined &&
      validated.anoMax !== undefined &&
      validated.anoMin > validated.anoMax
    ) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('anoMinCannotBeGreaterThanAnoMax', 'VALIDATION_ERROR'));
      return;
    }

    /**
     * @validation Validate price range consistency
     * @throw {ValidationError}
     */
    if (
      validated.precoMin !== undefined &&
      validated.precoMax !== undefined &&
      validated.precoMin > validated.precoMax
    ) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('precoMinCannotBeGreaterThanPrecoMax', 'VALIDATION_ERROR'));
      return;
    }

    /**
     * @rule {fn-vehicle-listing} Execute vehicle listing with filters
     */
    const data = await vehicleList(validated);

    res.json(
      successResponse(data, {
        page: data.pagina,
        pageSize: data.itensPorPagina,
        total: data.total,
      })
    );
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

/**
 * @api {get} /internal/vehicle/filter-options Get Filter Options
 * @apiName GetFilterOptions
 * @apiGroup Vehicle
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves available filter options based on current catalog
 *
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String[]} data.marcas Available brands
 * @apiSuccess {String[]} data.modelos Available models
 * @apiSuccess {Number[]} data.anos Available years
 * @apiSuccess {String[]} data.cambios Available transmission types
 *
 * @apiError {String} ServerError Internal server error
 */
export async function filterOptionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @rule {fn-filter-options} Retrieve available filter options
     */
    const data = await getFilterOptions();

    res.json(successResponse(data));
  } catch (error: any) {
    next(error);
  }
}

/**
 * @api {get} /internal/vehicle/modelos-by-marcas Get Models by Brands
 * @apiName GetModelosByMarcas
 * @apiGroup Vehicle
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves models filtered by selected brands
 *
 * @apiParam {String[]} [marcas] Selected brands
 *
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String[]} data.modelos Available models for selected brands
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function modelosByMarcasHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const querySchema = z.object({
    marcas: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
  });

  try {
    /**
     * @validation Validate query parameters
     * @throw {ValidationError}
     */
    const validated = querySchema.parse(req.query);

    /**
     * @rule {fn-modelos-by-marcas} Retrieve models filtered by brands
     */
    const modelos = await getModelosByMarcas(validated.marcas || []);

    res.json(successResponse({ modelos }));
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
