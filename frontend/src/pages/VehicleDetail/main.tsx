import { useParams } from 'react-router-dom';
import { useVehicleDetail } from '@/domain/vehicle/hooks';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { Button } from '@/core/components/Button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { VehicleCard } from '@/domain/vehicle/components';
import { ContactForm } from '@/domain/contact/components';
import { useState } from 'react';

export const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useNavigation();
  const { vehicle, isLoading, error } = useVehicleDetail({ id: id || '' });
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showAllItems, setShowAllItems] = useState<Record<string, boolean>>({});
  const [showContactForm, setShowContactForm] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-[60vh] center">
        <div className="stack gap-4 items-center text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600">Veículo não encontrado</h2>
          <p className="text-muted-foreground">
            O veículo que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={goBack}>Voltar para listagem</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
  };

  const groupItemsByCategory = (items: typeof vehicle.itensSerie) => {
    const grouped: Record<string, typeof items> = {};
    items.forEach((item) => {
      if (!grouped[item.categoria]) {
        grouped[item.categoria] = [];
      }
      grouped[item.categoria].push(item);
    });
    return grouped;
  };

  const toggleShowAll = (category: string) => {
    setShowAllItems((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const renderItemsGroup = (items: typeof vehicle.itensSerie, title: string) => {
    const grouped = groupItemsByCategory(items);
    const categories = Object.keys(grouped);

    if (categories.length === 0) return null;

    return (
      <div className="stack gap-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {categories.map((category) => {
          const categoryItems = grouped[category];
          const limit = 10;
          const shouldShowToggle = categoryItems.length > limit;
          const isExpanded = showAllItems[category];
          const displayItems = isExpanded ? categoryItems : categoryItems.slice(0, limit);

          return (
            <div key={category} className="stack gap-2">
              <h4 className="font-medium text-primary-600">{category}</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {displayItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-primary-600" />
                    {item.nome}
                  </li>
                ))}
              </ul>
              {shouldShowToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleShowAll(category)}
                  className="self-start"
                >
                  {isExpanded ? 'Ver menos' : `Ver mais (${categoryItems.length - limit})`}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="stack gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={goBack}>
          ← Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="stack gap-4">
          <div className="aspect-video w-full overflow-hidden rounded-sm border border-border bg-muted">
            <img
              src={vehicle.fotos[selectedPhoto]?.url || vehicle.imagemPrincipal}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="w-full h-full object-cover cursor-zoom-in"
            />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {vehicle.fotos.map((foto, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(index)}
                className={`aspect-video overflow-hidden rounded-sm border-2 transition-all ${
                  selectedPhoto === index
                    ? 'border-primary-600 scale-105'
                    : 'border-border hover:border-primary-600/50'
                }`}
              >
                <img
                  src={foto.url}
                  alt={foto.legenda || `Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="stack gap-6">
          <div className="stack gap-2">
            <h1 className="text-3xl font-bold">
              {vehicle.marca} {vehicle.modelo}
            </h1>
            <p className="text-lg text-muted-foreground">Ano: {vehicle.ano}</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-primary-600">{formatPrice(vehicle.preco)}</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'Disponível'
                    ? 'bg-green-100 text-green-800'
                    : vehicle.status === 'Reservado'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
          </div>

          <div className="p-4 border border-border rounded-sm bg-muted/50 stack gap-3">
            <h3 className="font-semibold">Destaques</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Quilometragem</span>
                <span className="font-medium">{formatKm(vehicle.quilometragem)}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Câmbio</span>
                <span className="font-medium">{vehicle.cambio}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Combustível</span>
                <span className="font-medium">{vehicle.especificacoes.combustivel}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Cor</span>
                <span className="font-medium">{vehicle.especificacoes.cor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 stack gap-8">
          <section className="p-6 border border-border rounded-sm stack gap-4">
            <h2 className="text-2xl font-bold">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Marca</span>
                <span className="font-medium">{vehicle.especificacoes.marca}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Modelo</span>
                <span className="font-medium">{vehicle.especificacoes.modelo}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Ano Fabricação</span>
                <span className="font-medium">{vehicle.especificacoes.anoFabricacao}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Ano Modelo</span>
                <span className="font-medium">{vehicle.especificacoes.anoModelo}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Motor</span>
                <span className="font-medium">{vehicle.especificacoes.motor}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Potência</span>
                <span className="font-medium">{vehicle.especificacoes.potencia}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Carroceria</span>
                <span className="font-medium">{vehicle.especificacoes.carroceria}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Portas</span>
                <span className="font-medium">{vehicle.especificacoes.portas}</span>
              </div>
              <div className="stack gap-1">
                <span className="text-sm text-muted-foreground">Final da Placa</span>
                <span className="font-medium">{vehicle.especificacoes.finalPlaca}</span>
              </div>
            </div>
          </section>

          <section className="p-6 border border-border rounded-sm stack gap-4">
            {renderItemsGroup(vehicle.itensSerie, 'Itens de Série')}
          </section>

          {vehicle.opcionais.length > 0 && (
            <section className="p-6 border border-border rounded-sm stack gap-4">
              {renderItemsGroup(vehicle.opcionais, 'Opcionais')}
            </section>
          )}

          <section className="p-6 border border-border rounded-sm stack gap-4">
            <h2 className="text-2xl font-bold">Histórico do Veículo</h2>
            <div className="stack gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="stack gap-1">
                  <span className="text-sm text-muted-foreground">Procedência</span>
                  <span className="font-medium">{vehicle.historico.procedencia}</span>
                </div>
                <div className="stack gap-1">
                  <span className="text-sm text-muted-foreground">Proprietários</span>
                  <span className="font-medium">{vehicle.historico.proprietarios}</span>
                </div>
                {vehicle.historico.garantia && (
                  <div className="stack gap-1">
                    <span className="text-sm text-muted-foreground">Garantia</span>
                    <span className="font-medium">{vehicle.historico.garantia}</span>
                  </div>
                )}
              </div>

              {(!vehicle.historico.sinistros || vehicle.historico.sinistros.length === 0) && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-sm">
                  <p className="text-sm font-medium text-green-800">✓ Sem registro de sinistros</p>
                </div>
              )}

              {vehicle.historico.revisoes && vehicle.historico.revisoes.length > 0 && (
                <div className="stack gap-2">
                  <h4 className="font-medium">Revisões</h4>
                  <div className="stack gap-2">
                    {vehicle.historico.revisoes.map((revisao, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-sm text-sm">
                        <p>
                          <strong>Data:</strong> {revisao.data}
                        </p>
                        <p>
                          <strong>Km:</strong> {formatKm(revisao.quilometragem)}
                        </p>
                        <p>
                          <strong>Local:</strong> {revisao.local}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="p-6 border border-border rounded-sm stack gap-4">
            <h2 className="text-2xl font-bold">Condições de Venda</h2>
            <div className="stack gap-4">
              <div className="stack gap-2">
                <h4 className="font-medium">Formas de Pagamento</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.condicoesVenda.formasPagamento.map((forma, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                    >
                      {forma}
                    </span>
                  ))}
                </div>
              </div>

              {vehicle.condicoesVenda.condicoesFinanciamento && (
                <div className="p-4 bg-muted/50 rounded-sm stack gap-2">
                  <h4 className="font-medium">Condições de Financiamento</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entrada mínima:</span>
                      <p className="font-medium">
                        {formatPrice(vehicle.condicoesVenda.condicoesFinanciamento.entradaMinima)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa de juros:</span>
                      <p className="font-medium">
                        {vehicle.condicoesVenda.condicoesFinanciamento.taxaJuros}% a.m.
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prazo máximo:</span>
                      <p className="font-medium">
                        {vehicle.condicoesVenda.condicoesFinanciamento.prazoMaximo} meses
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Aceita troca:</span>
                <span className="font-medium">
                  {vehicle.condicoesVenda.aceitaTroca ? 'Sim' : 'Não'}
                </span>
              </div>

              {vehicle.condicoesVenda.observacoesVenda && (
                <div className="p-3 bg-muted/50 rounded-sm">
                  <p className="text-sm">{vehicle.condicoesVenda.observacoesVenda}</p>
                </div>
              )}

              <div className="stack gap-2">
                <h4 className="font-medium">Documentação Necessária</h4>
                <ul className="stack gap-1">
                  {vehicle.condicoesVenda.documentacaoNecessaria.map((doc, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="size-1.5 rounded-full bg-primary-600 mt-1.5" />
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        {doc.observacoes && (
                          <p className="text-muted-foreground">{doc.observacoes}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border border-border rounded-sm stack gap-2">
                <h4 className="font-medium">Situação Documental</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.condicoesVenda.situacaoDocumental.status === 'Regular'
                        ? 'bg-green-100 text-green-800'
                        : vehicle.condicoesVenda.situacaoDocumental.status === 'Pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {vehicle.condicoesVenda.situacaoDocumental.status}
                  </span>
                </div>
                {vehicle.condicoesVenda.situacaoDocumental.pendencias &&
                  vehicle.condicoesVenda.situacaoDocumental.pendencias.length > 0 && (
                    <div className="stack gap-1">
                      <span className="text-sm font-medium">Pendências:</span>
                      <ul className="stack gap-1">
                        {vehicle.condicoesVenda.situacaoDocumental.pendencias.map(
                          (pendencia, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <span className="size-1.5 rounded-full bg-yellow-600" />
                              {pendencia}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {vehicle.condicoesVenda.situacaoDocumental.observacoes && (
                  <p className="text-sm text-muted-foreground">
                    {vehicle.condicoesVenda.situacaoDocumental.observacoes}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="stack gap-6">
          <div className="p-6 border border-border rounded-sm bg-muted/50 sticky top-20 stack gap-4">
            {!showContactForm ? (
              <>
                <h3 className="text-xl font-semibold">Interessado?</h3>
                <p className="text-sm text-muted-foreground">
                  Entre em contato conosco para mais informações sobre este veículo.
                </p>
                <Button className="w-full" size="lg" onClick={() => setShowContactForm(true)}>
                  Entrar em Contato
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Formulário de Contato</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowContactForm(false)}>
                    ✕
                  </Button>
                </div>
                <ContactForm
                  vehicle={vehicle}
                  onSuccess={() => {
                    setTimeout(() => setShowContactForm(false), 5000);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {vehicle.veiculosSimilares.length > 0 && (
        <section className="stack gap-6">
          <div className="stack gap-2">
            <h2 className="text-2xl font-bold">Veículos Similares</h2>
            <p className="text-muted-foreground">Confira outros veículos que podem te interessar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicle.veiculosSimilares.slice(0, 6).map((similarVehicle) => (
              <VehicleCard key={similarVehicle.id} vehicle={similarVehicle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
