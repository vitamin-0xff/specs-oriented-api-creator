# Spring Boot Application Generator  
## Architecture & Specification Plan (v1)

---

## 1. Overview

This project aims to **automate the generation of Spring Boot application features**
from a single, well-defined JSON specification.

The system takes a declarative specification describing:
- Domain models
- CRUD and custom repository operations
- Service-layer behavior
- REST controllers
- Role-based access rules

and transforms it into a **ready-to-run Spring Boot API**.

The specification is framework-agnostic, while the generated output strictly follows
Spring Boot best practices.

---

## 2. Core Design Principles

- Single source of truth (JSON specification)
- Declarative over imperative
- Strict separation of concerns
- Deterministic generation
- Extensible architecture
- Safe regeneration (idempotent output)

---

## 3. High-Level Architecture

Specification Author
↓
Frontend (Editor + Validator)
↓
JSON Specification
↓
Parser
↓
Raw Spec Model
↓
Intermediate Representation (IR)
↓
Transformers
↓
Code Generators
↓
Spring Boot Application
---

## 4. Frontend Responsibilities

### 4.1 Specification Authoring

- JSON-based specification editor
- Autocomplete and inline documentation
- Schema-based validation

### 4.2 Validation

Two validation layers:
1. Structural validation using JSON Schema
2. Semantic validation:
   - Duplicate entity or feature names
   - Invalid field references
   - Missing identifiers
   - Conflicting security rules

### 4.3 Optional Preview

- Entities and relationships
- Generated endpoints
- Role-based access overview

### 4.4 Submission

- Versioned specification submission
- Immutable spec snapshots

---

## 5. Backend Responsibilities

- Parse and validate specifications
- Normalize and resolve definitions
- Transform abstract definitions into Spring-aware models
- Generate clean, maintainable source code

---

## 6. Specification Model (v1)

### 6.1 Root Structure

The application is described by a single document:

- Project metadata
- A list of features

Each feature represents a bounded context.

---

## 7. Feature-Based Modeling

Each feature bundles everything required to expose a complete API surface.

A feature contains:
- Entity definition
- Repository behavior
- Service behavior
- Controller behavior
- Security rules

This design enforces cohesion and prevents cross-feature coupling.

---

## 8. Entity Definition

Entities define the domain model.

They include:
- Name and table mapping
- Fields and primitive types
- Explicit relationships

The entity model is persistence-agnostic and contains no framework annotations.

---

## 9. Repository Definition

Repositories declare:
- Whether persistence is enabled
- Query intent (find, exists, delete, custom)
- Criteria and expected return type

Spring Data–specific method naming is handled later by transformers.

---

## 10. Service Definition

Services describe:
- Business-level operations
- Which repository operation they invoke
- Transaction boundaries

Services form the single entry point for business logic.

---

## 11. Controller Definition

Controllers expose REST endpoints.

Each endpoint declares:
- HTTP method
- URL path
- Linked service method
- Request body presence

Controllers never access repositories directly.

---

## 12. Security Definition

Security rules are declared independently of implementation.

Supports:
- Default roles for entire controllers
- Method-level role overrides
- Role-to-endpoint mapping

Security transformers later convert these rules into authorization annotations.

---

## 13. Parsing Layer

The parser:
- Reads the JSON specification
- Converts it into strongly typed spec models
- Performs structural validation

No Spring-specific logic is applied at this stage.

---

## 14. Intermediate Representation (IR)

The IR is a resolved, normalized model.

It:
- Resolves relationships
- Applies defaults
- Makes implicit behavior explicit

This layer decouples the input specification from the output framework.

---

## 15. Transformer Layer

Transformers incrementally enrich the IR:

- Entity transformer: relationships, identifiers, equality
- Repository transformer: query methods, pagination
- Service transformer: transactions, validation
- Controller transformer: routing, request/response binding
- Security transformer: authorization mapping

Transformers are composable and order-dependent.

---

## 16. Code Generation Layer

Generators convert the final IR into source files.

Characteristics:
- Template-based
- One generator per artifact
- Human-readable output
- Spring Boot–conventional structure

---

## 17. Output Structure

src/main/java/...
├── domain
├── repository
├── service
├── controller
└── security
---

## 18. Extensibility Strategy

Future features can be added via:
- New transformers
- Additional generators

Planned extensions:
- DTO generation
- Mapper generation
- OpenAPI documentation
- Auditing and soft delete
- Multi-tenancy

---

## 19. Non-Functional Requirements

- Idempotent generation
- Safe overwrite strategies
- Clear error reporting
- Versioned specifications

---

## 20. Implementation Roadmap

1. Freeze specification model v1
2. Create JSON Schema
3. Implement parser and validator
4. Define IR models
5. Implement entity transformer
6. Generate minimal CRUD feature
7. Expand to services, controllers, and security

---

## 21. Summary

This architecture provides:
- Clear separation of concerns
- Strong typing and validation
- Deterministic generation
- Long-term extensibility

The system is suitable for both rapid scaffolding and production-grade API generation.
