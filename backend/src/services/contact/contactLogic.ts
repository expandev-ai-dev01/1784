import {
  ContactCreateRequest,
  ContactEntity,
  ContactCreateResponse,
  ContactStatus,
} from './contactTypes';

/**
 * @summary
 * In-memory storage for contact submissions
 */
const contacts: ContactEntity[] = [];
let contactIdCounter = 1;

/**
 * @summary
 * Generates a unique protocol number for contact tracking
 *
 * @function generateProtocolo
 * @module contact
 *
 * @returns {string} Protocol number in format YYYYMMDDNNNNN
 *
 * @example
 * const protocolo = generateProtocolo();
 * // Returns: '2024011200001'
 */
function generateProtocolo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequential = String(contactIdCounter).padStart(5, '0');

  return `${year}${month}${day}${sequential}`;
}

/**
 * @summary
 * Creates a new contact submission with protocol generation
 *
 * @function contactCreate
 * @module contact
 *
 * @param {ContactCreateRequest} params - Contact creation parameters
 *
 * @returns {Promise<ContactCreateResponse>} Contact creation confirmation with protocol
 *
 * @example
 * const result = await contactCreate({
 *   nomeCompleto: 'João Silva',
 *   email: 'joao@example.com',
 *   telefone: '(11) 98765-4321',
 *   preferenciaContato: 'WhatsApp',
 *   idVeiculo: 1,
 *   modeloVeiculo: 'Honda Civic 2023',
 *   assunto: 'Informações gerais',
 *   mensagem: 'Gostaria de mais informações sobre este veículo',
 *   termosPrivacidade: true,
 *   ipUsuario: '192.168.1.1'
 * });
 */
export async function contactCreate(params: ContactCreateRequest): Promise<ContactCreateResponse> {
  /**
   * @rule {fn-contact-protocol-generation} Generate unique protocol number
   */
  const protocolo = generateProtocolo();

  /**
   * @rule {fn-contact-entity-creation} Create contact entity with all data
   */
  const contact: ContactEntity = {
    id: contactIdCounter++,
    protocolo,
    nomeCompleto: params.nomeCompleto,
    email: params.email,
    telefone: params.telefone,
    preferenciaContato: params.preferenciaContato,
    melhorHorario: params.melhorHorario || 'Qualquer horário',
    idVeiculo: params.idVeiculo,
    modeloVeiculo: params.modeloVeiculo,
    assunto: params.assunto,
    mensagem: params.mensagem,
    financiamento: params.financiamento || false,
    receberNovidades: params.receberNovidades || false,
    status: ContactStatus.Novo,
    dataEnvio: new Date(),
    ipUsuario: params.ipUsuario,
  };

  /**
   * @rule {fn-contact-storage} Store contact in memory
   */
  contacts.push(contact);

  /**
   * @remarks Simulate email sending (in production, integrate with email service)
   * Email confirmation to user and notification to sales team would be sent here
   */
  console.log('Contact created:', {
    protocolo: contact.protocolo,
    email: contact.email,
    veiculo: contact.modeloVeiculo,
  });

  return {
    protocolo: contact.protocolo,
    mensagem: 'Seu contato foi recebido com sucesso! Em breve retornaremos.',
    prazoResposta: '24 horas úteis',
  };
}

/**
 * @summary
 * Retrieves all contact submissions (for internal use)
 *
 * @function contactList
 * @module contact
 *
 * @returns {Promise<ContactEntity[]>} Array of all contacts
 *
 * @example
 * const allContacts = await contactList();
 */
export async function contactList(): Promise<ContactEntity[]> {
  return [...contacts];
}

/**
 * @summary
 * Retrieves a specific contact by protocol number
 *
 * @function contactGetByProtocolo
 * @module contact
 *
 * @param {string} protocolo - Protocol number
 *
 * @returns {Promise<ContactEntity | null>} Contact entity or null if not found
 *
 * @example
 * const contact = await contactGetByProtocolo('2024011200001');
 */
export async function contactGetByProtocolo(protocolo: string): Promise<ContactEntity | null> {
  return contacts.find((c) => c.protocolo === protocolo) || null;
}
