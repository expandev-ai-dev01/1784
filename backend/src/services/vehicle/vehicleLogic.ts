import {
  VehicleEntity,
  VehicleListRequest,
  VehicleListResponse,
  VehicleDetailResponse,
  FilterOptionsResponse,
  TransmissionType,
  VehicleStatus,
  SortCriteria,
  VehiclePhoto,
  VehicleSpecifications,
  VehicleItem,
  VehicleHistory,
  VehicleSaleConditions,
} from './vehicleTypes';

/**
 * @summary
 * In-memory storage for vehicle data
 */
const vehicles: VehicleEntity[] = [
  {
    id: 1,
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2023,
    preco: 145000,
    imagemPrincipal: 'https://example.com/civic.jpg',
    quilometragem: 5000,
    cambio: TransmissionType.Automatico,
  },
  {
    id: 2,
    modelo: 'Corolla',
    marca: 'Toyota',
    ano: 2022,
    preco: 135000,
    imagemPrincipal: 'https://example.com/corolla.jpg',
    quilometragem: 15000,
    cambio: TransmissionType.CVT,
  },
  {
    id: 3,
    modelo: 'Onix',
    marca: 'Chevrolet',
    ano: 2023,
    preco: 85000,
    imagemPrincipal: 'https://example.com/onix.jpg',
    quilometragem: 2000,
    cambio: TransmissionType.Manual,
  },
  {
    id: 4,
    modelo: 'HB20',
    marca: 'Hyundai',
    ano: 2021,
    preco: 75000,
    imagemPrincipal: 'https://example.com/hb20.jpg',
    quilometragem: 30000,
    cambio: TransmissionType.Manual,
  },
  {
    id: 5,
    modelo: 'Compass',
    marca: 'Jeep',
    ano: 2023,
    preco: 185000,
    imagemPrincipal: 'https://example.com/compass.jpg',
    quilometragem: 8000,
    cambio: TransmissionType.Automatico,
  },
];

/**
 * @summary
 * Lists vehicles with filtering, sorting, and pagination
 *
 * @function vehicleList
 * @module vehicle
 *
 * @param {VehicleListRequest} params - Listing parameters with filters
 *
 * @returns {Promise<VehicleListResponse>} Paginated vehicle list with metadata
 *
 * @example
 * const result = await vehicleList({
 *   marcas: ['Honda', 'Toyota'],
 *   anoMin: 2020,
 *   ordenacao: 'Preço (menor para maior)',
 *   pagina: 1,
 *   itensPorPagina: 12
 * });
 */
export async function vehicleList(params: VehicleListRequest): Promise<VehicleListResponse> {
  const {
    marcas,
    modelos,
    anoMin,
    anoMax,
    precoMin,
    precoMax,
    cambios,
    ordenacao = SortCriteria.Relevancia,
    pagina = 1,
    itensPorPagina = 12,
  } = params;

  /**
   * @rule {fn-vehicle-filtering} Apply filters to vehicle list
   */
  let filteredVehicles = [...vehicles];

  if (marcas && marcas.length > 0) {
    filteredVehicles = filteredVehicles.filter((v) => marcas.includes(v.marca));
  }

  if (modelos && modelos.length > 0) {
    filteredVehicles = filteredVehicles.filter((v) => modelos.includes(v.modelo));
  }

  if (anoMin !== undefined) {
    filteredVehicles = filteredVehicles.filter((v) => v.ano >= anoMin);
  }

  if (anoMax !== undefined) {
    filteredVehicles = filteredVehicles.filter((v) => v.ano <= anoMax);
  }

  if (precoMin !== undefined) {
    filteredVehicles = filteredVehicles.filter((v) => v.preco >= precoMin);
  }

  if (precoMax !== undefined) {
    filteredVehicles = filteredVehicles.filter((v) => v.preco <= precoMax);
  }

  if (cambios && cambios.length > 0) {
    filteredVehicles = filteredVehicles.filter((v) => v.cambio && cambios.includes(v.cambio));
  }

  /**
   * @rule {fn-vehicle-sorting} Apply sorting to filtered results
   */
  switch (ordenacao) {
    case SortCriteria.PrecoMenor:
      filteredVehicles.sort((a, b) => a.preco - b.preco);
      break;
    case SortCriteria.PrecoMaior:
      filteredVehicles.sort((a, b) => b.preco - a.preco);
      break;
    case SortCriteria.AnoRecente:
      filteredVehicles.sort((a, b) => b.ano - a.ano);
      break;
    case SortCriteria.AnoAntigo:
      filteredVehicles.sort((a, b) => a.ano - b.ano);
      break;
    case SortCriteria.ModeloAZ:
      filteredVehicles.sort((a, b) => a.modelo.localeCompare(b.modelo));
      break;
    case SortCriteria.ModeloZA:
      filteredVehicles.sort((a, b) => b.modelo.localeCompare(a.modelo));
      break;
    case SortCriteria.Relevancia:
    default:
      break;
  }

  const total = filteredVehicles.length;
  const totalPaginas = Math.ceil(total / itensPorPagina);

  /**
   * @rule {fn-vehicle-pagination} Apply pagination to sorted results
   */
  const startIndex = (pagina - 1) * itensPorPagina;
  const endIndex = startIndex + itensPorPagina;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  return {
    veiculos: paginatedVehicles,
    total,
    pagina,
    itensPorPagina,
    totalPaginas,
  };
}

/**
 * @summary
 * Retrieves complete details of a specific vehicle
 *
 * @function vehicleGet
 * @module vehicle
 *
 * @param {number} id - Vehicle identifier
 *
 * @returns {Promise<VehicleDetailResponse | null>} Complete vehicle details or null if not found
 *
 * @example
 * const vehicle = await vehicleGet(1);
 */
export async function vehicleGet(id: number): Promise<VehicleDetailResponse | null> {
  /**
   * @rule {fn-vehicle-retrieval} Find vehicle by ID
   */
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return null;
  }

  /**
   * @rule {fn-vehicle-detail-construction} Build complete vehicle details
   */
  const fotos: VehiclePhoto[] = [
    {
      url: vehicle.imagemPrincipal,
      legenda: 'Vista frontal',
      principal: true,
    },
    {
      url: `https://example.com/${vehicle.modelo.toLowerCase()}-lateral.jpg`,
      legenda: 'Vista lateral',
      principal: false,
    },
    {
      url: `https://example.com/${vehicle.modelo.toLowerCase()}-traseira.jpg`,
      legenda: 'Vista traseira',
      principal: false,
    },
    {
      url: `https://example.com/${vehicle.modelo.toLowerCase()}-interior.jpg`,
      legenda: 'Interior',
      principal: false,
    },
  ];

  const especificacoes: VehicleSpecifications = {
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    anoFabricacao: vehicle.ano,
    anoModelo: vehicle.ano,
    quilometragem: vehicle.quilometragem || 0,
    combustivel: 'Flex',
    cambio: vehicle.cambio || TransmissionType.Manual,
    potencia: '120 cv',
    cor: 'Prata',
    portas: 4,
    carroceria: 'Sedan',
    motor: '1.8',
    finalPlaca: 5,
  };

  const itensSerie: VehicleItem[] = [
    { nome: 'Ar condicionado', categoria: 'Conforto' },
    { nome: 'Direção elétrica', categoria: 'Conforto' },
    { nome: 'Vidros elétricos', categoria: 'Conforto' },
    { nome: 'Travas elétricas', categoria: 'Conforto' },
    { nome: 'Airbag duplo', categoria: 'Segurança' },
    { nome: 'Freios ABS', categoria: 'Segurança' },
    { nome: 'Alarme', categoria: 'Segurança' },
  ];

  const opcionais: VehicleItem[] = [
    { nome: 'Teto solar', categoria: 'Conforto' },
    { nome: 'Bancos em couro', categoria: 'Conforto' },
    { nome: 'Central multimídia', categoria: 'Tecnologia' },
    { nome: 'Câmera de ré', categoria: 'Tecnologia' },
    { nome: 'Sensor de estacionamento', categoria: 'Tecnologia' },
  ];

  const historico: VehicleHistory = {
    procedencia: 'Particular',
    proprietarios: 1,
    garantia: vehicle.quilometragem && vehicle.quilometragem < 50000 ? '1 ano' : null,
    semSinistros: true,
    revisoesEmDia: true,
  };

  const condicoesVenda: VehicleSaleConditions = {
    formasPagamento: ['À vista', 'Financiamento', 'Consórcio'],
    aceitaTroca: true,
    observacoes: null,
    financiamentoDisponivel: true,
  };

  /**
   * @rule {fn-similar-vehicles} Find similar vehicles based on brand, price range, and year
   */
  const veiculosSimilares = vehicles
    .filter((v) => {
      if (v.id === id) return false;
      const priceDiff = Math.abs(v.preco - vehicle.preco);
      const priceRange = vehicle.preco * 0.3;
      return v.marca === vehicle.marca && priceDiff <= priceRange;
    })
    .slice(0, 6);

  return {
    id: vehicle.id,
    tituloAnuncio: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`,
    preco: vehicle.preco,
    status: VehicleStatus.Disponivel,
    imagemPrincipal: vehicle.imagemPrincipal,
    fotos,
    especificacoes,
    itensSerie,
    opcionais,
    historico,
    condicoesVenda,
    veiculosSimilares,
  };
}

/**
 * @summary
 * Retrieves available filter options based on current catalog
 *
 * @function getFilterOptions
 * @module vehicle
 *
 * @returns {Promise<FilterOptionsResponse>} Available filter options
 *
 * @example
 * const options = await getFilterOptions();
 */
export async function getFilterOptions(): Promise<FilterOptionsResponse> {
  const marcas = Array.from(new Set(vehicles.map((v) => v.marca))).sort();
  const modelos = Array.from(new Set(vehicles.map((v) => v.modelo))).sort();
  const anos = Array.from(new Set(vehicles.map((v) => v.ano))).sort((a, b) => b - a);
  const cambios = Array.from(
    new Set(vehicles.map((v) => v.cambio).filter((c): c is string => c !== null))
  ).sort();

  return {
    marcas,
    modelos,
    anos,
    cambios,
  };
}

/**
 * @summary
 * Retrieves models filtered by selected brands
 *
 * @function getModelosByMarcas
 * @module vehicle
 *
 * @param {string[]} marcas - Selected brands
 *
 * @returns {Promise<string[]>} Available models for selected brands
 *
 * @example
 * const modelos = await getModelosByMarcas(['Honda', 'Toyota']);
 */
export async function getModelosByMarcas(marcas: string[]): Promise<string[]> {
  if (!marcas || marcas.length === 0) {
    return Array.from(new Set(vehicles.map((v) => v.modelo))).sort();
  }

  const filteredModelos = vehicles.filter((v) => marcas.includes(v.marca)).map((v) => v.modelo);

  return Array.from(new Set(filteredModelos)).sort();
}
