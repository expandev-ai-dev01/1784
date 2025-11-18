# Catálogo de Carros

Listagem de carros, onde ao clicar no card consigo ver detalhes e preencher um formulário de contato.

## Tecnologias

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.2
- Tailwind CSS 4.1.17
- React Router DOM 7.9.6
- TanStack Query 5.90.2
- Zustand 5.0.8
- React Hook Form 7.66.1
- Zod 4.1.12
- Axios 1.13.2

## Estrutura do Projeto

```
src/
├── assets/          # Estilos globais e assets
├── core/            # Componentes, hooks e utilitários compartilhados
│   ├── components/  # Componentes UI reutilizáveis
│   ├── contexts/    # Contextos React
│   ├── hooks/       # Hooks customizados
│   ├── lib/         # Configurações de bibliotecas
│   ├── stores/      # Estado global (Zustand)
│   ├── types/       # Tipos TypeScript globais
│   └── utils/       # Funções utilitárias
├── domain/          # Domínios de negócio
├── layouts/         # Layouts da aplicação
├── pages/           # Páginas da aplicação
├── router/          # Configuração de rotas
├── App.tsx          # Componente raiz
└── main.tsx         # Ponto de entrada
```

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Funcionalidades

- **Listagem de carros**: Exibição de todos os veículos disponíveis no catálogo
- **Visualização de detalhes**: Informações completas sobre cada veículo
- **Formulário de contato**: Manifestação de interesse e contato com a empresa

## Padrões de Código

- TypeScript strict mode habilitado
- Componentes funcionais com hooks
- Path mapping com `@/` para imports
- Tailwind CSS para estilização
- Zustand para gerenciamento de estado
- TanStack Query para estado do servidor
- React Hook Form + Zod para formulários