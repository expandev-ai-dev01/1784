export const HomePage = () => {
  return (
    <div className="stack gap-8">
      <section className="text-center stack gap-4">
        <h2 className="text-4xl font-bold">Bem-vindo ao Catálogo de Carros</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore nossa seleção de veículos disponíveis. Encontre o carro perfeito para você.
        </p>
      </section>

      <section className="stack gap-6">
        <div className="center">
          <p className="text-muted-foreground">Carregando catálogo...</p>
        </div>
      </section>
    </div>
  );
};
