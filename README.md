# SvelteKit with Elysia Backend Integration

This template demonstrates how to integrate Elysia (a Bun-based backend framework) with SvelteKit. It includes authentication, database integration, and API route handling.

## Features

- 🚀 SvelteKit frontend
- ⚡ Elysia backend with Bun
- 🔐 JWT Authentication
- 🗃️ PostgreSQL with Drizzle ORM
- 🌐 API client with type safety

## Step-by-Step Setup

### 1. Project Structure

First, create a SvelteKit project and add necessary dependencies:

```bash
# Create new SvelteKit project
npm create svelte@latest my-app
cd my-app

# Install dependencies
bun add elysia @elysiajs/swagger @elysiajs/jwt @elysiajs/eden
bun add @node-rs/argon2 @oslojs/encoding
bun add drizzle-orm postgres
bun add -d drizzle-kit @types/pg
```

### 2. Backend Setup

Create the API route handler at `src/routes/api/[...slugs]/+server.ts`:

```typescript
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

const app = new Elysia({ prefix: '/api' })
  .use(swagger())
  .get('/hi', () => 'Hi Elysia');

export type App = typeof app;

// Handle both GET and POST requests
export const GET = ({ request }) => app.handle(request);
export const POST = ({ request }) => app.handle(request);
```

### 3. Database Configuration

Set up PostgreSQL with Docker and create schema:

```bash
# Docker compose for PostgreSQL
docker compose up -d

# Run database migrations
bun run db:push
```

### 4. Authentication System

Implement authentication in `src/lib/server/auth.ts`:

```typescript
import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const authRouter = new Elysia({ prefix: '/auth' })
  .use(jwt({
    secret: process.env.JWT_SECRET
  }))
  .post('/login', async ({ body, jwt }) => {
    // Login logic
  })
  .post('/register', async ({ body, jwt }) => {
    // Registration logic
  });
```

### 5. API Client

Create a type-safe API client in `src/lib/api/client.ts`:

```typescript
import { treaty } from '@elysiajs/eden';
import type { App } from '@/routes/api/[...slugs]/+server';

export const api = treaty<App>(import.meta.env.PUBLIC_API_URL);
```

### 6. Environment Setup

Create `.env` file with necessary variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
JWT_SECRET="your-secret-key"
PUBLIC_API_URL="http://localhost:5173/api"
```

## Development

1. Start the database:
```bash
bun run db:start
```

2. Run migrations:
```bash
bun run db:push
```

3. Start development server:
```bash
bun run dev
```

## API Documentation

Once running, access the Swagger documentation at:
- http://localhost:5173/api/swagger

> **Note**: Due to a known issue in @elysiajs/swagger v1.2.0, the Swagger UI may attempt to call incorrect URLs. A workaround has been implemented in `hooks.server.ts` to redirect `/swagger/json` to `/api/swagger/json`. If you experience any issues with Swagger documentation, ensure this hook is properly configured:

```typescript
// src/hooks.server.ts
import { handle } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  if (event.url.pathname === '/swagger/json') {
    return Response.redirect('/api/swagger/json', 301);
  }

  return resolve(event);
};
```

## Authentication Endpoints

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user info

## Type Safety

The project utilizes full type safety between frontend and backend through:
- Elysia's built-in type inference
- Eden treaty for type-safe API calls
- TypeScript throughout the codebase

## Production Deployment

For production deployment:

1. Build the application:
```bash
bun run build
```

2. Start the production server:
```bash
bun run preview
```

## Learn More

- [SvelteKit Documentation](https://kit.svelte.dev)
- [Elysia Documentation](https://elysiajs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)