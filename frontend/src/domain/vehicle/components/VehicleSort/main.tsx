import type { VehicleSortProps } from './types';

export const VehicleSort = ({ value, onChange }: VehicleSortProps) => {
  const sortOptions = [
    { value: 'relevancia', label: 'Relevância' },
    { value: 'preco_asc', label: 'Preço (menor para maior)' },
    { value: 'preco_desc', label: 'Preço (maior para menor)' },
    { value: 'ano_desc', label: 'Ano (mais recente)' },
    { value: 'ano_asc', label: 'Ano (mais antigo)' },
    { value: 'modelo_asc', label: 'Modelo (A-Z)' },
    { value: 'modelo_desc', label: 'Modelo (Z-A)' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-sm border border-input bg-background px-3 py-2 text-sm min-w-[200px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
