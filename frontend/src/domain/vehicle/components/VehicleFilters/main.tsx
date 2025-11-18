import { useState, useEffect } from 'react';
import { Button } from '@/core/components/Button';
import { Input } from '@/core/components/Input';
import type { VehicleFiltersProps } from './types';
import type { VehicleListParams } from '../../types';

export const VehicleFilters = ({
  filterOptions,
  onFilterChange,
  initialFilters,
  isLoadingFilters,
  onGetModelosByMarcas,
}: VehicleFiltersProps) => {
  const [filters, setFilters] = useState<VehicleListParams>(initialFilters || {});
  const [availableModelos, setAvailableModelos] = useState<string[]>(filterOptions?.modelos || []);

  useEffect(() => {
    if (filterOptions?.modelos) {
      setAvailableModelos(filterOptions.modelos);
    }
  }, [filterOptions]);

  useEffect(() => {
    const fetchModelos = async () => {
      if (filters.marcas && filters.marcas.length > 0) {
        try {
          const result = await onGetModelosByMarcas(filters.marcas);
          setAvailableModelos(result.modelos);

          if (filters.modelos && filters.modelos.length > 0) {
            const validModelos = filters.modelos.filter((modelo) =>
              result.modelos.includes(modelo)
            );
            if (validModelos.length !== filters.modelos.length) {
              setFilters((prev) => ({ ...prev, modelos: validModelos }));
            }
          }
        } catch (error) {
          console.error('Error fetching modelos:', error);
        }
      } else {
        setAvailableModelos(filterOptions?.modelos || []);
        if (filters.modelos && filters.modelos.length > 0) {
          setFilters((prev) => ({ ...prev, modelos: [] }));
        }
      }
    };

    fetchModelos();
  }, [filters.marcas, filterOptions?.modelos, onGetModelosByMarcas]);

  const handleMultiSelectChange = (field: keyof VehicleListParams, value: string) => {
    setFilters((prev) => {
      const currentValues = (prev[field] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues.length > 0 ? newValues : undefined };
    });
  };

  const handleInputChange = (field: keyof VehicleListParams, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters: VehicleListParams = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  if (isLoadingFilters) {
    return (
      <div className="p-4 border border-border rounded-sm bg-background">
        <p className="text-muted-foreground">Carregando filtros...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-border rounded-sm bg-background stack gap-4">
      <h3 className="text-lg font-semibold">Filtros</h3>

      <div className="stack gap-4">
        <div className="stack gap-2">
          <label className="text-sm font-medium">Marca</label>
          <div className="stack gap-2 max-h-48 overflow-y-auto">
            {filterOptions?.marcas.map((marca) => (
              <label key={marca} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.marcas?.includes(marca) || false}
                  onChange={() => handleMultiSelectChange('marcas', marca)}
                  className="size-4 rounded border-border"
                />
                <span className="text-sm">{marca}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="stack gap-2">
          <label className="text-sm font-medium">Modelo</label>
          <div className="stack gap-2 max-h-48 overflow-y-auto">
            {availableModelos.length > 0 ? (
              availableModelos.map((modelo) => (
                <label key={modelo} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.modelos?.includes(modelo) || false}
                    onChange={() => handleMultiSelectChange('modelos', modelo)}
                    className="size-4 rounded border-border"
                  />
                  <span className="text-sm">{modelo}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Selecione uma marca primeiro</p>
            )}
          </div>
        </div>

        <div className="stack gap-2">
          <label className="text-sm font-medium">Ano</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Mínimo</label>
              <select
                value={filters.anoMin || ''}
                onChange={(e) => handleInputChange('anoMin', e.target.value)}
                className="w-full h-10 rounded-sm border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Qualquer</option>
                {filterOptions?.anos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Máximo</label>
              <select
                value={filters.anoMax || ''}
                onChange={(e) => handleInputChange('anoMax', e.target.value)}
                className="w-full h-10 rounded-sm border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Qualquer</option>
                {filterOptions?.anos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="stack gap-2">
          <label className="text-sm font-medium">Preço</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Mínimo</label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={filters.precoMin || ''}
                onChange={(e) => handleInputChange('precoMin', e.target.value)}
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Máximo</label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={filters.precoMax || ''}
                onChange={(e) => handleInputChange('precoMax', e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="stack gap-2">
          <label className="text-sm font-medium">Câmbio</label>
          <div className="stack gap-2">
            {filterOptions?.cambios.map((cambio) => (
              <label key={cambio} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.cambios?.includes(cambio) || false}
                  onChange={() => handleMultiSelectChange('cambios', cambio)}
                  className="size-4 rounded border-border"
                />
                <span className="text-sm">{cambio}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        <Button onClick={handleApplyFilters} className="flex-1">
          Aplicar Filtros
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="flex-1">
          Limpar
        </Button>
      </div>
    </div>
  );
};
