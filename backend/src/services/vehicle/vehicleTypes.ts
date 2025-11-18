/**
 * @interface VehicleEntity
 * @description Represents a vehicle entity in the system
 *
 * @property {number} id - Unique vehicle identifier
 * @property {string} modelo - Vehicle model name
 * @property {string} marca - Vehicle brand/manufacturer
 * @property {number} ano - Vehicle manufacturing year
 * @property {number} preco - Vehicle price in BRL
 * @property {string} imagemPrincipal - URL of the main vehicle image
 * @property {number | null} quilometragem - Vehicle mileage in kilometers
 * @property {string | null} cambio - Transmission type
 */
export interface VehicleEntity {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  imagemPrincipal: string;
  quilometragem: number | null;
  cambio: string | null;
}

/**
 * @interface VehicleListRequest
 * @description Request parameters for vehicle listing with filters and pagination
 *
 * @property {string[]} [marcas] - Filter by brands
 * @property {string[]} [modelos] - Filter by models
 * @property {number} [anoMin] - Minimum year filter
 * @property {number} [anoMax] - Maximum year filter
 * @property {number} [precoMin] - Minimum price filter
 * @property {number} [precoMax] - Maximum price filter
 * @property {string[]} [cambios] - Filter by transmission types
 * @property {string} [ordenacao] - Sort criteria
 * @property {number} [pagina] - Current page number
 * @property {number} [itensPorPagina] - Items per page
 */
export interface VehicleListRequest {
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

/**
 * @interface VehicleListResponse
 * @description Response structure for vehicle listing
 *
 * @property {VehicleEntity[]} veiculos - Array of vehicles
 * @property {number} total - Total number of vehicles matching filters
 * @property {number} pagina - Current page number
 * @property {number} itensPorPagina - Items per page
 * @property {number} totalPaginas - Total number of pages
 */
export interface VehicleListResponse {
  veiculos: VehicleEntity[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

/**
 * @interface FilterOptionsResponse
 * @description Available filter options based on current catalog
 *
 * @property {string[]} marcas - Available brands
 * @property {string[]} modelos - Available models
 * @property {number[]} anos - Available years
 * @property {string[]} cambios - Available transmission types
 */
export interface FilterOptionsResponse {
  marcas: string[];
  modelos: string[];
  anos: number[];
  cambios: string[];
}

/**
 * @interface VehiclePhoto
 * @description Represents a vehicle photo in the gallery
 *
 * @property {string} url - Photo URL
 * @property {string | null} legenda - Photo caption
 * @property {boolean} principal - Whether this is the main photo
 */
export interface VehiclePhoto {
  url: string;
  legenda: string | null;
  principal: boolean;
}

/**
 * @interface VehicleSpecifications
 * @description Technical specifications of a vehicle
 *
 * @property {string} marca - Vehicle brand
 * @property {string} modelo - Vehicle model
 * @property {number} anoFabricacao - Manufacturing year
 * @property {number} anoModelo - Model year
 * @property {number} quilometragem - Current mileage
 * @property {string} combustivel - Fuel type
 * @property {string} cambio - Transmission type
 * @property {string} potencia - Engine power
 * @property {string} cor - Vehicle color
 * @property {number} portas - Number of doors
 * @property {string} carroceria - Body type
 * @property {string} motor - Engine specification
 * @property {number} finalPlaca - License plate final digit
 */
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

/**
 * @interface VehicleItem
 * @description Represents a vehicle item or optional
 *
 * @property {string} nome - Item name
 * @property {string} categoria - Item category
 */
export interface VehicleItem {
  nome: string;
  categoria: string;
}

/**
 * @interface VehicleHistory
 * @description Vehicle history information
 *
 * @property {string} procedencia - Vehicle origin
 * @property {number} proprietarios - Number of previous owners
 * @property {string | null} garantia - Warranty information
 * @property {boolean} semSinistros - No accident records flag
 * @property {boolean} revisoesEmDia - Up-to-date maintenance flag
 */
export interface VehicleHistory {
  procedencia: string;
  proprietarios: number;
  garantia: string | null;
  semSinistros: boolean;
  revisoesEmDia: boolean;
}

/**
 * @interface VehicleSaleConditions
 * @description Sale conditions for a vehicle
 *
 * @property {string[]} formasPagamento - Accepted payment methods
 * @property {boolean} aceitaTroca - Accepts trade-in flag
 * @property {string | null} observacoes - Additional notes
 * @property {boolean} financiamentoDisponivel - Financing available flag
 */
export interface VehicleSaleConditions {
  formasPagamento: string[];
  aceitaTroca: boolean;
  observacoes: string | null;
  financiamentoDisponivel: boolean;
}

/**
 * @interface VehicleDetailResponse
 * @description Complete vehicle details response
 *
 * @property {number} id - Vehicle identifier
 * @property {string} tituloAnuncio - Advertisement title
 * @property {number} preco - Vehicle price
 * @property {string} status - Vehicle status
 * @property {string} imagemPrincipal - Main image URL
 * @property {VehiclePhoto[]} fotos - Photo gallery
 * @property {VehicleSpecifications} especificacoes - Technical specifications
 * @property {VehicleItem[]} itensSerie - Standard items
 * @property {VehicleItem[]} opcionais - Optional items
 * @property {VehicleHistory} historico - Vehicle history
 * @property {VehicleSaleConditions} condicoesVenda - Sale conditions
 * @property {VehicleEntity[]} veiculosSimilares - Similar vehicles
 */
export interface VehicleDetailResponse {
  id: number;
  tituloAnuncio: string;
  preco: number;
  status: string;
  imagemPrincipal: string;
  fotos: VehiclePhoto[];
  especificacoes: VehicleSpecifications;
  itensSerie: VehicleItem[];
  opcionais: VehicleItem[];
  historico: VehicleHistory;
  condicoesVenda: VehicleSaleConditions;
  veiculosSimilares: VehicleEntity[];
}

/**
 * @enum TransmissionType
 * @description Valid transmission types
 */
export enum TransmissionType {
  Manual = 'Manual',
  Automatico = 'Automático',
  CVT = 'CVT',
  SemiAutomatico = 'Semi-automático',
}

/**
 * @enum VehicleStatus
 * @description Valid vehicle status values
 */
export enum VehicleStatus {
  Disponivel = 'Disponível',
  Reservado = 'Reservado',
  Vendido = 'Vendido',
}

/**
 * @enum SortCriteria
 * @description Valid sort criteria for vehicle listing
 */
export enum SortCriteria {
  Relevancia = 'Relevância',
  PrecoMenor = 'Preço (menor para maior)',
  PrecoMaior = 'Preço (maior para menor)',
  AnoRecente = 'Ano (mais recente)',
  AnoAntigo = 'Ano (mais antigo)',
  ModeloAZ = 'Modelo (A-Z)',
  ModeloZA = 'Modelo (Z-A)',
}
