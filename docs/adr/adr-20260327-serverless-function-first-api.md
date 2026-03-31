# ADR: Use function-centered serverless API instead of Express runtime

## Status
Accepted

## Context
The existing `apps/api` structure is based on an Express server.  
However, the Juyaro Bible Project is targeting a serverless-friendly deployment model for its MVP.

The product’s initial backend needs are:
- fixed scripture reading retrieval
- note creation and update
- reflection question flow
- group post and comment APIs

The system does not require websocket-based real-time communication or a long-running monolithic API server.

## Decision
The project will not use Express as the primary runtime architecture.

Instead, the backend will adopt a function-centered API model using route handlers or serverless functions as the HTTP entrypoint.

Business logic will remain separated into application/service and repository layers.

## Consequences
- the deployment model becomes more aligned with serverless platforms
- API entrypoints remain smaller and simpler
- operational complexity is reduced for MVP delivery
- business logic remains testable and portable outside the transport layer
- existing Express-oriented structure may need refactoring during migration

## Rejected Alternative
### Express + adapter
This option was considered but rejected as the target architecture.

Reason:
- it adds runtime indirection
- it is less natural for a serverless-first deployment model
- it does not provide enough benefit for the current MVP scope