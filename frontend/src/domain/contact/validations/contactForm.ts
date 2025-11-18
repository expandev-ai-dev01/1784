import { z } from 'zod';

export const contactFormSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, 'O nome deve conter pelo menos 3 caracteres')
    .max(100, 'O nome deve conter no máximo 100 caracteres')
    .refine(
      (val) => val.trim().split(/\s+/).length >= 2,
      'Por favor, informe seu nome completo (nome e sobrenome)'
    ),
  email: z
    .string()
    .email('Por favor, informe um endereço de e-mail válido no formato usuario@dominio.com')
    .max(100, 'O e-mail deve conter no máximo 100 caracteres')
    .refine(
      (val) => val.includes('.') && val.split('@')[1]?.includes('.'),
      'O e-mail deve conter um domínio válido'
    ),
  telefone: z
    .string()
    .min(10, 'O telefone deve conter pelo menos 10 dígitos incluindo DDD')
    .regex(
      /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      'Por favor, informe um número de telefone válido com DDD'
    ),
  preferenciaContato: z.enum(['Telefone', 'E-mail', 'WhatsApp'], {
    errorMap: () => ({ message: 'Por favor, selecione sua preferência de contato' }),
  }),
  melhorHorario: z
    .enum(['Manhã', 'Tarde', 'Noite', 'Qualquer horário'])
    .default('Qualquer horário')
    .optional(),
  idVeiculo: z.number().int().positive(),
  modeloVeiculo: z.string().min(1),
  assunto: z.enum(
    [
      'Informações gerais',
      'Agendamento de test drive',
      'Negociação de preço',
      'Financiamento',
      'Outro',
    ],
    {
      errorMap: () => ({ message: 'Por favor, selecione o assunto da sua consulta' }),
    }
  ),
  mensagem: z
    .string()
    .min(10, 'Por favor, forneça mais detalhes em sua mensagem (mínimo 10 caracteres)')
    .max(1000, 'Sua mensagem excedeu o limite de 1000 caracteres'),
  financiamento: z.boolean().default(false).optional(),
  termosPrivacidade: z.literal(true, {
    errorMap: () => ({
      message: 'É necessário concordar com os termos de privacidade para prosseguir',
    }),
  }),
  receberNovidades: z.boolean().default(false).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
