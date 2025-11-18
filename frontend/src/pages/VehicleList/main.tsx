import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVehicleList } from '@/domain/vehicle/hooks';
import {
  VehicleCard,
  VehicleFilters,
  VehicleSort,
  VehiclePagination,
} from '@/domain/vehicle/components';
import type { VehicleListParams } from '@/domain/vehicle/types';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

export const VehicleListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFiltersFromUrl = (): VehicleListParams => {
    const filters: VehicleListParams = {};

    const marcas = searchParams.getAll('marcas');
    if (marcas.length > 0) filters.marcas = marcas;

    const modelos = searchParams.getAll('modelos');
    if (modelos.length > 0) filters.modelos = modelos;

    const anoMin = searchParams.get('anoMin');
    if (anoMin) filters.anoMin = parseInt(anoMin);

    const anoMax = searchParams.get('anoMax');
    if (anoMax) filters.anoMax = parseInt(anoMax);

    const precoMin = searchParams.get('precoMin');
    if (precoMin) filters.precoMin = parseFloat(precoMin);

    const precoMax = searchParams.get('precoMax');
    if (precoMax) filters.precoMax = parseFloat(precoMax);

    const cambios = searchParams.getAll('cambios');
    if (cambios.length > 0) filters.cambios = cambios;

    const ordenacao = searchParams.get('ordenacao');
    if (ordenacao) filters.ordenacao = ordenacao;

    const pagina = searchParams.get('pagina');
    filters.pagina = pagina ? parseInt(pagina) : 1;

    const itensPorPagina = searchParams.get('itensPorPagina');
    filters.itensPorPagina = itensPorPagina ? parseInt(itensPorPagina) : 12;

    return filters;
  };

  const [filters, setFilters] = useState<VehicleListParams>(getFiltersFromUrl());

  const {
    vehicles,
    total,
    pagina,
    itensPorPagina,
    totalPaginas,
    isLoading,
    error,
    filterOptions,
    isLoadingFilters,
    getModelosByMarcas,
  } = useVehicleList({ filters });

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.marcas) filters.marcas.forEach((m) => params.append('marcas', m));
    if (filters.modelos) filters.modelos.forEach((m) => params.append('modelos', m));
    if (filters.anoMin) params.set('anoMin', filters.anoMin.toString());
    if (filters.anoMax) params.set('anoMax', filters.anoMax.toString());
    if (filters.precoMin) params.set('precoMin', filters.precoMin.toString());
    if (filters.precoMax) params.set('precoMax', filters.precoMax.toString());
    if (filters.cambios) filters.cambios.forEach((c) => params.append('cambios', c));
    if (filters.ordenacao) params.set('ordenacao', filters.ordenacao);
    if (filters.pagina) params.set('pagina', filters.pagina.toString());
    if (filters.itensPorPagina) params.set('itensPorPagina', filters.itensPorPagina.toString());

    setSearchParams(params);
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (totalPaginas > 0 && pagina > totalPaginas) {
      setFilters((prev) => ({ ...prev, pagina: totalPaginas }));
    }
  }, [totalPaginas, pagina]);

  useEffect(() => {
    if (filters.pagina && filters.pagina > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filters.pagina]);

  const handleFilterChange = (newFilters: VehicleListParams) => {
    setFilters({ ...newFilters, pagina: 1, itensPorPagina: filters.itensPorPagina });
  };

  const handleSortChange = (ordenacao: string) => {
    setFilters((prev) => ({ ...prev, ordenacao }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, pagina: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setFilters((prev) => ({ ...prev, itensPorPagina: itemsPerPage, pagina: 1 }));
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] center">
        <div className="stack gap-4 items-center text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600">Erro ao carregar veículos</h2>
          <p className="text-muted-foreground">
            Ocorreu um erro ao carregar os dados. Por favor, tente novamente.
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary-600 text-white rounded-sm hover:bg-primary-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (total === 0 && !filters.marcas && !filters.modelos && !filters.anoMin && !filters.precoMin) {
    return (
      <div className="min-h-[60vh] center">
        <div className="stack gap-4 items-center text-center max-w-md">
          <h2 className="text-2xl font-bold">Catálogo vazio</h2>
          <p className="text-muted-foreground">
            Não há veículos disponíveis no catálogo no momento. Por favor, volte mais tarde ou entre
            em contato conosco para mais informações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="stack gap-8">
      <section className="text-center stack gap-4">
        <h1 className="text-4xl font-bold">Catálogo de Veículos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore nossa seleção de veículos disponíveis. Use os filtros para encontrar o carro
          perfeito para você.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 flex-shrink-0">
          <VehicleFilters
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
            isLoadingFilters={isLoadingFilters}
            onGetModelosByMarcas={getModelosByMarcas}
          />
        </aside>

        <main className="flex-1 stack gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Exibindo {(pagina - 1) * itensPorPagina + 1}-
              {Math.min(pagina * itensPorPagina, total)} de {total} veículos
            </p>
            <VehicleSort value={filters.ordenacao || 'relevancia'} onChange={handleSortChange} />
          </div>

          {vehicles.length === 0 ? (
            <div className="min-h-[40vh] center">
              <div className="stack gap-4 items-center text-center max-w-md">
                <h3 className="text-xl font-semibold">Nenhum veículo encontrado</h3>
                <p className="text-muted-foreground">
                  Não encontramos veículos com os filtros selecionados. Tente remover alguns filtros
                  ou alterar os critérios de busca para ampliar os resultados.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <VehiclePagination
                  currentPage={pagina}
                  totalPages={totalPaginas}
                  itemsPerPage={itensPorPagina}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
