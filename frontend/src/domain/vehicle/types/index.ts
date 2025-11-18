export interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  imagemPrincipal: string;
  quilometragem?: number;
  cambio?: string;
}

export interface VehicleListParams {
  marcas?: string[];
  modelos?: string[];
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  cambios?: string[];
  ordenacao?: string;
  pagina?: number;
  itensPorPagina?: number;
}

export interface VehicleListResponse {
  veiculos: Vehicle[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface FilterOptions {
  marcas: string[];
  modelos: string[];
  anos: number[];
  cambios: string[];
}

export interface ModelosByMarcasResponse {
  modelos: string[];
}

export interface VehicleDetail {
  id: string;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  imagemPrincipal: string;
  quilometragem: number;
  cambio: string;
  status: string;
  fotos: VehiclePhoto[];
  especificacoes: VehicleSpecifications;
  itensSerie: VehicleItem[];
  opcionais: VehicleItem[];
  historico: VehicleHistory;
  condicoesVenda: SaleConditions;
  veiculosSimilares: Vehicle[];
}

export interface VehiclePhoto {
  url: string;
  legenda?: string;
}

export interface VehicleSpecifications {
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  quilometragem: number;
  combustivel: string;
  cambio: string;
  potencia: string;
  cor: string;
  portas: number;
  carroceria: string;
  motor: string;
  finalPlaca: number;
}

export interface VehicleItem {
  nome: string;
  categoria: string;
}

export interface VehicleHistory {
  procedencia: string;
  proprietarios: number;
  garantia?: string;
  revisoes?: VehicleRevision[];
  sinistros?: VehicleSinister[];
  laudoTecnico?: TechnicalReport;
}

export interface VehicleRevision {
  data: string;
  quilometragem: number;
  local: string;
}

export interface VehicleSinister {
  data: string;
  tipo: string;
  descricao: string;
}

export interface TechnicalReport {
  dataInspecao: string;
  resultadoGeral: string;
}

export interface SaleConditions {
  formasPagamento: string[];
  condicoesFinanciamento?: FinancingConditions;
  aceitaTroca: boolean;
  observacoesVenda?: string;
  documentacaoNecessaria: DocumentItem[];
  situacaoDocumental: DocumentalStatus;
}

export interface FinancingConditions {
  entradaMinima: number;
  taxaJuros: number;
  prazoMaximo: number;
}

export interface DocumentItem {
  nome: string;
  observacoes?: string;
}

export interface DocumentalStatus {
  status: string;
  pendencias?: string[];
  observacoes?: string;
}
