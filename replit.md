# Treasury Movement Simulator

## Overview

This is a B2B fintech treasury operations simulator designed for African businesses handling multiple currencies (KES, USD, NGN). The application provides a comprehensive dashboard for managing virtual accounts and simulating cross-currency transfers with real-time foreign exchange conversion.

## System Architecture

The application follows a modern full-stack architecture using:

- **Frontend**: React with TypeScript, Vite for building, and Tailwind CSS with shadcn/ui components
- **Backend**: Node.js with Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **Deployment**: Replit with autoscale deployment target

The architecture is organized in a monorepo structure with clear separation of concerns:
- `client/` - Frontend React application
- `server/` - Backend Express API
- `shared/` - Shared TypeScript types and database schema

## Key Components

### Database Layer
- **Drizzle ORM** with PostgreSQL for type-safe database operations
- **Schema Definition** (`shared/schema.ts`) defines accounts and transactions tables
- **Migration System** using drizzle-kit for schema versioning

### API Layer
- **REST API** (`server/routes.ts`) with endpoints for:
  - `GET /api/accounts` - Retrieve all accounts
  - `GET /api/transactions` - Retrieve transactions with filtering
  - `POST /api/transfer` - Execute money transfers
- **Storage Abstraction** (`server/storage.ts`) with in-memory implementation for development

### Frontend Components
- **Dashboard** - Main interface showing account overview and statistics
- **Account Cards** - Individual account displays with balance and currency info
- **Transfer Form** - Multi-currency transfer interface with validation
- **Transaction Log** - Historical transaction display with filtering
- **Currency Utilities** - Helper functions for formatting and FX conversion

### UI System
- **shadcn/ui Components** - Pre-built, accessible UI components
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Material Design Elements** - Elevation and shadow effects for modern appearance

## Data Flow

1. **Account Management**: Static account initialization with predefined balances across KES, USD, and NGN currencies
2. **Transfer Processing**: 
   - Frontend validation (balance checks, currency conversion preview)
   - API validation and processing
   - Account balance updates
   - Transaction record creation
3. **Real-time Updates**: React Query for automatic data refetching after mutations
4. **Currency Conversion**: Static FX rates with automatic conversion calculations

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for type-safe frontend development
- **Express.js** for backend API server
- **Drizzle ORM** with PostgreSQL driver (@neondatabase/serverless)

### UI and Styling
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessible, unstyled primitives
- **Lucide React** for consistent iconography

### Development and Build Tools
- **Vite** for fast development and optimized builds
- **TSX** for TypeScript execution in development
- **ESBuild** for production bundling

### Data Management
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **Date-fns** for date manipulation

## Deployment Strategy

The application is configured for Replit's autoscale deployment with:

- **Development Mode**: `npm run dev` - Runs TSX with hot reload on port 5000
- **Production Build**: `npm run build` - Vite build + ESBuild bundling
- **Production Start**: `npm run start` - Serves built application
- **Database**: PostgreSQL module provisioned automatically by Replit

The build process:
1. Frontend build with Vite (outputs to `dist/public`)
2. Backend bundling with ESBuild (outputs to `dist/index.js`)
3. Static file serving from Express for SPA routing

Environment variables required:
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)

## Changelog

- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.