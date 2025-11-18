import { useNavigation } from '@/core/hooks/useNavigation';
import { Card } from '@/core/components/Card';
import type { VehicleCardProps } from './types';
import { cn } from '@/core/utils/cn';

export const VehicleCard = ({ vehicle, className }: VehicleCardProps) => {
  const { navigate } = useNavigation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatKm = (km?: number) => {
    if (!km) return null;
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
  };

  const handleClick = () => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Ver detalhes do ${vehicle.marca} ${vehicle.modelo}`}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={vehicle.imagemPrincipal || '/placeholder-car.jpg'}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4 stack gap-3">
        <div className="stack gap-1">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          <p className="text-sm text-muted-foreground">Ano: {vehicle.ano}</p>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {vehicle.quilometragem && (
            <span className="text-sm text-muted-foreground">{formatKm(vehicle.quilometragem)}</span>
          )}
          {vehicle.cambio && (
            <span className="text-sm text-muted-foreground">{vehicle.cambio}</span>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-2xl font-bold text-primary-600">{formatPrice(vehicle.preco)}</p>
        </div>
      </div>
    </Card>
  );
};
