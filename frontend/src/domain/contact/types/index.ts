export interface ContactFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  preferenciaContato: 'Telefone' | 'E-mail' | 'WhatsApp';
  melhorHorario?: 'Manhã' | 'Tarde' | 'Noite' | 'Qualquer horário';
  idVeiculo: number;
  modeloVeiculo: string;
  assunto:
    | 'Informações gerais'
    | 'Agendamento de test drive'
    | 'Negociação de preço'
    | 'Financiamento'
    | 'Outro';
  mensagem: string;
  financiamento?: boolean;
  termosPrivacidade: boolean;
  receberNovidades?: boolean;
}

export interface ContactResponse {
  protocolo: string;
  mensagem: string;
  prazoResposta: string;
}
