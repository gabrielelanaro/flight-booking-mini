## Project Overview

This lightweight NestJS flight booking API skeleton is built for live demos and workshops. It demonstrates a complete booking workflow with a clean separation of concerns via the repository pattern.

## General Workflow

- **Small, focused commits** keep each change easy to reason about.
- **Test-driven approach**: write failing tests before implementation and let them guide behavior.
- **Code quality first**: ensure linting, formatting, and type checking succeed before committing.

## Common Development Commands

```bash
# Development
npm run start:dev          # Start development server with file watching
npm run start              # Build and start the application
npm run build              # Build the project to dist/

# Testing
npm test                  # Run unit tests
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint              # Run ESLint with auto-fix
npm run format            # Format code with Prettier
```

## Architecture

The application follows a modular NestJS architecture with a clear controller → service → repository flow:

- **App Module** (`src/app.module.ts`): Root module that imports BookingsModule.
- **Bookings Module** (`src/bookings/`): Core booking functionality.
  - **Controller** (`bookings.controller.ts`): HTTP endpoints with validation.
  - **Service** (`bookings.service.ts`): Business logic layer.
  - **Repository** (`bookings.repository.ts`): Data access layer with in-memory storage.
  - **DTOs** (`dto/`): Data transfer objects decorated with class-validator.
  - **Entity** (`entities/booking.entity.ts`): TypeScript interface for the Booking model.

## Key Features

- RESTful API with automatic validation using class-validator.
- Repository pattern for data access and easy persistence swaps.
- In-memory storage with clear upgrade path to databases.
- Comprehensive error handling and end-to-end coverage.

## API Endpoints

- `POST /bookings` - Create new booking.
- `GET /bookings` - List all bookings.
- `GET /bookings/:id` - Get booking by ID.
- `PATCH /bookings/:id/status` - Update booking status.

## Implementation Practices

- **Validation pipes**: Apply NestJS `ValidationPipe` for automatic request validation.
- **Error handling**: Return appropriate HTTP status codes (e.g., `404` for missing resources).
- **Layering discipline**: Keep controller, service, and repository responsibilities distinct.

## Testing Guidance

- **Development flow**: Use test-first development, maintain single-responsibility per test, and group cases by endpoint or feature.
- **Isolation**: Use `beforeEach`/`afterEach` to prepare and clean fixtures.
- **Structure**: Keep unit tests co-located as `*.spec.ts` and e2e tests under `test/*.e2e-spec.ts`; Jest is configured with SWC for speed.
- **HTTP server typing**: In e2e tests, type the server once using `const server = app.getHttpServer() as unknown as Server;` after importing `Server` from `http`.
- **Coverage expectations**: Exercise happy paths, error scenarios, and edge cases to ensure comprehensive behavior.

## Type Safety

- **No `any`**: Import concrete types and use precise assertions.
- **Response body assertions**: Cast responses before assertions, e.g.:
  ```ts
  interface ErrorResponse {
    message: string | string[];
    error: string;
    statusCode: number;
  }
  expect((response.body as ErrorResponse).message).toContain('error');
  const bookings = response.body as Booking[];
  expect(bookings[0].id).toBe(expectedId);
  ```

## Linting Guidelines

- **Catch blocks**: Prefer parameterless `catch { ... }` over unused parameters.

## Dependencies

Built with the modern NestJS 11 stack:
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- class-validator for input validation
- class-transformer for data transformation
- Jest with SWC for testing
