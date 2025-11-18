/**
 * @interface ContactCreateRequest
 * @description Request parameters for creating a contact submission
 *
 * @property {string} nomeCompleto - Full name of the user
 * @property {string} email - Email address for contact
 * @property {string} telefone - Phone number with DDD
 * @property {string} preferenciaContato - Preferred contact method
 * @property {string} [melhorHorario] - Best time to contact
 * @property {number} idVeiculo - Vehicle identifier
 * @property {string} modeloVeiculo - Vehicle model information
 * @property {string} assunto - Subject of the inquiry
 * @property {string} mensagem - Detailed message
 * @property {boolean} [financiamento] - Interest in financing
 * @property {boolean} termosPrivacidade - Privacy terms acceptance
 * @property {boolean} [receberNovidades] - Opt-in for news
 * @property {string} ipUsuario - User IP address
 */
export interface ContactCreateRequest {
  nomeCompleto: string;
  email: string;
  telefone: string;
  preferenciaContato: string;
  melhorHorario?: string;
  idVeiculo: number;
  modeloVeiculo: string;
  assunto: string;
  mensagem: string;
  financiamento?: boolean;
  termosPrivacidade: boolean;
  receberNovidades?: boolean;
  ipUsuario: string;
}

/**
 * @interface ContactEntity
 * @description Represents a contact submission in the system
 *
 * @property {number} id - Unique contact identifier
 * @property {string} protocolo - Protocol number for tracking
 * @property {string} nomeCompleto - Full name of the user
 * @property {string} email - Email address
 * @property {string} telefone - Phone number
 * @property {string} preferenciaContato - Preferred contact method
 * @property {string | null} melhorHorario - Best time to contact
 * @property {number} idVeiculo - Vehicle identifier
 * @property {string} modeloVeiculo - Vehicle model
 * @property {string} assunto - Subject of inquiry
 * @property {string} mensagem - Message content
 * @property {boolean} financiamento - Interest in financing
 * @property {boolean} receberNovidades - Opt-in for news
 * @property {string} status - Contact status
 * @property {Date} dataEnvio - Submission date and time
 * @property {string} ipUsuario - User IP address
 */
export interface ContactEntity {
  id: number;
  protocolo: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  preferenciaContato: string;
  melhorHorario: string | null;
  idVeiculo: number;
  modeloVeiculo: string;
  assunto: string;
  mensagem: string;
  financiamento: boolean;
  receberNovidades: boolean;
  status: string;
  dataEnvio: Date;
  ipUsuario: string;
}

/**
 * @interface ContactCreateResponse
 * @description Response structure for contact creation
 *
 * @property {string} protocolo - Protocol number for tracking
 * @property {string} mensagem - Confirmation message
 * @property {string} prazoResposta - Expected response time
 */
export interface ContactCreateResponse {
  protocolo: string;
  mensagem: string;
  prazoResposta: string;
}

/**
 * @enum ContactStatus
 * @description Valid contact status values
 */
export enum ContactStatus {
  Novo = 'Novo',
  EmAtendimento = 'Em atendimento',
  Concluido = 'Concluído',
  Cancelado = 'Cancelado',
}
