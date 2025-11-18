import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/middleware';
import { HTTP_STATUS } from '@/constants';
import { contactCreate } from '@/services/contact';

/**
 * @api {post} /external/contact Submit Contact Form
 * @apiName SubmitContactForm
 * @apiGroup Contact
 * @apiVersion 1.0.0
 *
 * @apiDescription Submits a contact form for a specific vehicle
 *
 * @apiParam {String} nomeCompleto Full name (3-100 characters, must include first and last name)
 * @apiParam {String} email Valid email address (max 100 characters)
 * @apiParam {String} telefone Brazilian phone number with DDD (min 10 digits)
 * @apiParam {String} preferenciaContato Contact preference: 'Telefone', 'E-mail', or 'WhatsApp'
 * @apiParam {String} [melhorHorario] Best time to contact: 'Manhã', 'Tarde', 'Noite', or 'Qualquer horário'
 * @apiParam {Number} idVeiculo Vehicle identifier
 * @apiParam {String} modeloVeiculo Vehicle model information
 * @apiParam {String} assunto Subject: 'Informações gerais', 'Agendamento de test drive', 'Negociação de preço', 'Financiamento', or 'Outro'
 * @apiParam {String} mensagem Message content (10-1000 characters)
 * @apiParam {Boolean} [financiamento] Interest in financing (default: false)
 * @apiParam {Boolean} termosPrivacidade Privacy terms acceptance (must be true)
 * @apiParam {Boolean} [receberNovidades] Opt-in for news and promotions (default: false)
 *
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} data.protocolo Protocol number for tracking
 * @apiSuccess {String} data.mensagem Confirmation message
 * @apiSuccess {String} data.prazoResposta Expected response time
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const bodySchema = z.object({
    nomeCompleto: z
      .string()
      .min(3, 'nomeDeveTerPeloMenos3Caracteres')
      .max(100, 'nomeDeveTerNoMaximo100Caracteres')
      .refine((val) => val.trim().split(/\s+/).length >= 2, 'nomeDeveConterNomeESobrenome'),
    email: z
      .string()
      .email('emailInvalido')
      .max(100, 'emailDeveTerNoMaximo100Caracteres')
      .refine(
        (val) => val.includes('.') && val.split('@')[1]?.includes('.'),
        'emailDeveConterDominioValido'
      ),
    telefone: z
      .string()
      .min(10, 'telefoneDeveConterPeloMenos10Digitos')
      .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'telefoneInvalido'),
    preferenciaContato: z.enum(['Telefone', 'E-mail', 'WhatsApp'], {
      errorMap: () => ({ message: 'preferenciaContatoInvalida' }),
    }),
    melhorHorario: z
      .enum(['Manhã', 'Tarde', 'Noite', 'Qualquer horário'])
      .default('Qualquer horário')
      .optional(),
    idVeiculo: z.coerce.number().int().positive('idVeiculoInvalido'),
    modeloVeiculo: z.string().min(1, 'modeloVeiculoObrigatorio'),
    assunto: z.enum(
      [
        'Informações gerais',
        'Agendamento de test drive',
        'Negociação de preço',
        'Financiamento',
        'Outro',
      ],
      {
        errorMap: () => ({ message: 'assuntoInvalido' }),
      }
    ),
    mensagem: z
      .string()
      .min(10, 'mensagemDeveTerPeloMenos10Caracteres')
      .max(1000, 'mensagemDeveTerNoMaximo1000Caracteres'),
    financiamento: z.boolean().default(false).optional(),
    termosPrivacidade: z.literal(true, {
      errorMap: () => ({ message: 'termosPrivacidadeDevemSerAceitos' }),
    }),
    receberNovidades: z.boolean().default(false).optional(),
  });

  try {
    /**
     * @validation Validate request body
     * @throw {ValidationError}
     */
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {fn-contact-auto-financing} Auto-set financing flag if subject is 'Financiamento'
     */
    if (validated.assunto === 'Financiamento') {
      validated.financiamento = true;
    }

    /**
     * @rule {fn-contact-creation} Create contact record with user data
     */
    const ipUsuario = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

    const data = await contactCreate({
      ...validated,
      ipUsuario,
    });

    res.status(HTTP_STATUS.CREATED).json(
      successResponse(data, {
        page: 1,
        pageSize: 1,
        total: 1,
      })
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('parametrosInvalidos', 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}
