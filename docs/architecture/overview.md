# Architecture Overview

## Purpose

This document defines the target architecture for the Juyaro Bible Project.

The project uses a pure serverless architecture designed for a low fixed cost, cheap-by-default MVP.
The system must remain modular, readable, and easy to deploy without any long-running backend server.

The architecture must support these initial product capabilities:
- QT reading
- note taking
- reflection questions
- group-based meditation sharing

## Architecture Decision

The project adopts a pure serverless architecture.

The backend is implemented as handler-based serverless functions.

Final architectural rules:
- no Express
- no Express + adapter
- no long-running server runtime
- handler/function-centered API entrypoints
- business logic lives in use-cases and services
- handlers stay thin and transport-focused

This direction is chosen because it fits:
- Cloudflare Pages for frontend delivery
- Cloudflare Workers for API execution
- stateless runtime assumptions
- cheap-by-default infrastructure
- low operational overhead for MVP delivery

## High-Level Structure

### Delivery Layer

Handles transport and runtime entrypoints.

Responsibilities:
- PWA routes and rendering
- serverless API handlers
- request parsing
- authentication checks
- input validation
- response formatting

### Application Layer

Handles use-cases and orchestration.

Responsibilities:
- reading plan retrieval
- reading session flow
- note creation and update
- reflection question and answer flow
- group post and comment operations
- membership-aware community actions

### Domain Layer

Defines core business entities and rules.

Domain examples:
- BibleVersion
- Book
- Chapter
- Verse
- ReadingPlan
- ReadingSession
- Bookmark
- Note
- ReflectionQuestion
- ReflectionAnswer
- Group
- GroupMembership
- Post
- Comment

### Infrastructure Layer

Handles external systems and technical integration points.

Responsibilities:
- scripture retrieval
- database access
- object storage integration
- authentication provider integration
- logging and monitoring
- caching and edge-friendly data access

## Runtime Model

The application assumes a stateless runtime.

Runtime rules:
- no in-memory session ownership
- no dependency on process-local state
- no local filesystem persistence
- each request must be independently executable
- all durable state lives in external systems

Persistent data must be stored in systems compatible with a serverless deployment model.

## API Entry Strategy

Every API capability is exposed through handler-based serverless endpoints.

Examples:
- `GET /api/reading/plans`
- `GET /api/reading/plans/:id`
- `POST /api/reading/sessions`
- `POST /api/notes`
- `PATCH /api/notes/:id`
- `GET /api/reflection/questions`
- `POST /api/reflection/answers`
- `GET /api/groups/:id/posts`
- `POST /api/groups/:id/posts`
- `POST /api/posts/:id/comments`

Request flow:

`handler -> use-case/service -> repository -> infrastructure`

Handler rules:
- handlers stay thin
- handlers do not contain business rules
- handlers do not own persistence logic
- business logic lives in use-cases/services

## Frontend and Backend Relationship

`apps/web` is the PWA frontend.
It consumes backend APIs exposed by `apps/api`.

The frontend is responsible for user experience, responsive layout, and local interaction flow.
The backend is responsible for data retrieval, command execution, and domain-safe state changes.

The backend remains UI-agnostic.

## Deployment Direction

Initial deployment targets:
- Cloudflare Pages for frontend delivery
- Cloudflare Workers for API execution

Deployment assumptions:
- frontend and API are independently deployable
- the API must run in a serverless, handler-first runtime
- scripture retrieval should be edge/serverless friendly
- infrastructure should remain cheap-by-default
- the system should avoid always-on backend hosting

## Engineering Principles

### Thin Handlers

Handlers only deal with transport concerns.

### Business Logic Outside Handlers

Use-cases and services own business behavior.

### Clear Module Boundaries

Reading, note, reflection, and community capabilities stay separated by domain boundaries.

### Stateless by Default

All backend behavior must remain valid in a stateless runtime.

### Edge-Friendly Retrieval

Scripture retrieval and read-heavy flows should be designed for serverless and edge-safe execution.

### Low-Cost Delivery

Architecture choices should favor low fixed cost and simple operations during MVP.

## Initial Module Boundaries

The initial architecture supports these modules:
- scripture
- reading
- notes
- reflection
- community
- auth
- shared

Each module may contain:
- handlers
- use-cases
- services
- repository interfaces
- infrastructure implementations
- schemas and DTOs

## Out of Scope for Initial Architecture

The initial architecture does not include:
- Express runtime
- Express + adapter
- monolithic always-on backend services
- websocket-based real-time chat
- local filesystem media storage
- complex event-driven distributed systems
- recommendation systems
- AI-generated meditation content

## Summary

Juyaro Bible Project uses a pure serverless architecture.

The frontend runs as a PWA on Cloudflare Pages.
The backend runs as handler-based serverless API functions on Cloudflare Workers.
The runtime is stateless, the infrastructure is cheap-by-default, and all business logic lives outside handlers in use-cases and services.
