export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen center">
      <div className="stack gap-4 items-center">
        <div className="size-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};
