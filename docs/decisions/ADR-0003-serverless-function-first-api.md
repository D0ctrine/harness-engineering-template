# ADR-0003: Use function-centered serverless API instead of Express runtime

## Status

Accepted

## Context

The project targets a low-cost serverless MVP.
The frontend is delivered as a PWA, and the backend must match a stateless deployment model.
The API needs thin HTTP entrypoints without introducing a long-running backend server.

## Decision

The API uses a function-centered serverless architecture.

Rules:
- Express is not used as primary runtime
- Express + adapter is rejected
- API endpoints are implemented as serverless handlers
- business logic remains separate from handlers
- initial target platform is Cloudflare Workers

## Consequences

- backend delivery aligns with a pure serverless runtime
- deployment stays cheap-by-default and operationally small
- handlers remain transport-focused
- use-cases, services, and repositories remain portable and testable
- API structure is optimized for stateless execution

## Rejected Alternatives

### Express server runtime

Rejected because it assumes a long-running server model that does not fit the target runtime.

### Express + serverless adapter

Rejected because it adds indirection without enough value for the MVP architecture.

### Higher-cost backend-first platforms

Rejected because the MVP should favor low fixed cost and simple deployment over heavier managed backend stacks.
