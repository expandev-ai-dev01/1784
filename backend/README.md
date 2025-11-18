# Catálogo de Carros - Backend API

## Description
Backend API for car catalog application with vehicle listing, details viewing, and contact form functionality.

## Features
- Vehicle listing with filtering and sorting
- Detailed vehicle information
- Contact form submission

## Technology Stack
- Node.js
- Express.js
- TypeScript
- In-memory data storage (no database)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### API Version 1
Base URL: `/api/v1`

#### External Routes (Public)
- Available at `/api/v1/external`

#### Internal Routes (Authenticated)
- Available at `/api/v1/internal`

## Project Structure

```
src/
├── api/              # API controllers
├── routes/           # Route definitions
├── middleware/       # Express middleware
├── services/         # Business logic
├── utils/            # Utility functions
├── constants/        # Application constants
├── instances/        # Service instances
└── server.ts         # Application entry point
```

## Development

- Development server with hot reload: `npm run dev`
- Build TypeScript: `npm run build`
- Production server: `npm start`

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `API_VERSION` - API version (default: v1)
- `CORS_ORIGINS` - Allowed CORS origins

## License
ISC
