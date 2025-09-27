## Project Overview

This is a lightweight NestJS flight booking API skeleton designed for live demos and workshops. It demonstrates a complete booking workflow with proper separation of concerns using the repository pattern.

## Common Development Commands

```bash
# Development
npm run start:dev          # Start development server with file watching
npm run start              # Build and start the application
npm run build             # Build the project to dist/

# Testing
npm test                  # Run unit tests
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint              # Run ESLint with auto-fix
npm run format            # Format code with Prettier
```

## Architecture

The application follows a modular NestJS architecture with clean separation of concerns:

- **App Module** (`src/app.module.ts`): Root module that imports BookingsModule
- **Bookings Module** (`src/bookings/`): Core booking functionality
  - **Controller** (`bookings.controller.ts`): HTTP endpoints with validation
  - **Service** (`bookings.service.ts`): Business logic layer
  - **Repository** (`bookings.repository.ts`): Data access layer with in-memory storage
  - **DTOs** (`dto/`): Data transfer objects with class-validator decorators
  - **Entity** (`entities/booking.entity.ts`): TypeScript interface for Booking model

## Key Features

- RESTful API with automatic validation using class-validator
- Repository pattern for data access
- In-memory storage (can be replaced with database)
- Comprehensive error handling
- End-to-end test coverage

## API Endpoints

- `POST /bookings` - Create new booking
- `GET /bookings` - List all bookings
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id/status` - Update booking status

## Testing Best Practices

- **Test-first development**: Write comprehensive tests BEFORE implementation to define clear specifications
- **Proper test isolation**: Use beforeEach/afterEach instead of manual setup/teardown in each test
- **Single responsibility**: Each test should validate exactly one behavior
- **Descriptive organization**: Group tests by endpoint/functionality with clear naming

## TypeScript Best Practices

- **Never use `any`**: Always import proper types and use specific type assertions
- **Type safety first**: Maintain type safety throughout the codebase, including tests
- **Proper imports**: Import specific types instead of using generic workarounds

## Linting Best Practices

- **Catch blocks**: Use parameterless `catch` instead of unused variables:
  ```ts
  // ❌ Avoid:
  catch (_) { ... }
  catch (__unused) { ... }

  // ✅ Do:
  catch { ... }
  ```

- **HTTP server typing in e2e tests**: Properly type NestJS HTTP server:
  ```ts
  // ❌ Avoid:
  await request(app.getHttpServer())

  // ✅ Do:
  const server = app.getHttpServer() as unknown as Server;
  await request(server)
  ```

- **Response body type assertions**: Use appropriate type casting for test assertions:
  ```ts
  // For typed responses:
  expect((response.body as Booking).id).toBe(expectedId)

  // For error responses (avoid 'any'):
  interface ErrorResponse {
    message: string | string[];
    error: string;
    statusCode: number;
  }
  expect((response.body as ErrorResponse).message).toContain('error')

  // For array elements:
  expect((response.body[0] as Booking).flightNumber).toBe('FL123')

  // For arrays (alternative approach):
  const bookings = response.body as Booking[];
  expect(bookings[0].id).toBe(expectedId)
  ```

- **Server import**: Always import the Server type from 'http' in e2e tests:
  ```ts
  import { Server } from 'http';
  ```

## API Development Best Practices

- **Validation pipes**: Use NestJS ValidationPipe for automatic request validation
- **Proper error handling**: Return appropriate HTTP status codes (404 for missing resources)
- **Clean architecture**: Maintain separation between Controller → Service → Repository layers
- **Comprehensive coverage**: Test happy paths, error cases, and edge cases

## General Workflow

- **Small, focused commits**: Each commit should represent a logical unit of work
- **Test-driven approach**: Let failing tests guide implementation
- **Code quality first**: Ensure linting, formatting, and type checking pass before committing

## Testing Structure

- Unit tests: Co-located with source files (`*.spec.ts`)
- E2E tests: `test/*.e2e-spec.ts`
- Jest configuration uses SWC for faster test execution
- Type nest http server like this in e2e tests:
  ```ts
  const server = app.getHttpServer() as unknown as Server;
  ```

## Dependencies

Built with modern NestJS 11 stack:
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- class-validator for input validation
- class-transformer for data transformation
- Jest with SWC for testing