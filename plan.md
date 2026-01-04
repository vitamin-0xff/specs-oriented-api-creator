# Spring Boot Application Generator  
## Implementation Plan (TypeScript + Deno)

This document describes the **step-by-step implementation plan** for building the
Spring Boot Application Generator using **TypeScript** running on the **Deno runtime**.

The plan is structured as a **checklist-driven roadmap** so progress can be tracked
clearly and objectively.

---

## 1. Tech Stack

### Runtime
- Deno (latest stable)

### Language
- TypeScript (strict mode enabled)

### Key Characteristics
- No build step
- ES modules only
- Explicit imports
- Strong typing end-to-end

---

## 2. Repository Structure

spring-boot-generator/
├── README.md
├── deno.json
├── src/
│ ├── cli/
│ ├── spec/
│ ├── parser/
│ ├── ir/
│ ├── transformers/
│ ├── generators/
│ ├── templates/
│ ├── utils/
│ └── main.ts
└── tests/
---

## 3. Phase 0 – Project Bootstrap

### Tasks
- [ ] Initialize Deno project
- [ ] Enable strict TypeScript settings
- [ ] Define formatting and linting rules
- [ ] Create base folder structure
- [ ] Add example spec file

### Output
- Runnable Deno project
- Empty but valid application skeleton

---

## 4. Phase 1 – Specification Model [DONE]

### Goal
Define the **frozen v1 specification model** used by frontend and backend.

### Tasks
- [ ] Define TypeScript interfaces for:
  - ApplicationSpec
  - ProjectSpec
  - FeatureSpec
  - EntitySpec
  - RepositorySpec
  - ServiceSpec
  - ControllerSpec
  - SecuritySpec
- [ ] Export models from a single module
- [ ] Write inline documentation for each field
- [ ] Add example JSON spec

### Output
- Strongly typed spec model
- Shared contract for entire system

---

## 5. Phase 2 – JSON Schema & Validation [DONE]

### Goal
Guarantee spec correctness before parsing.

### Tasks
- [ ] Define JSON Schema for spec v1
- [ ] Implement schema validation
- [ ] Add semantic validations:
  - Unique feature names
  - Unique entity names
  - Valid field references
  - Valid service-method bindings
  - Valid security rule targets
- [ ] Return clear, structured error messages

### Output
- Reject invalid specs early
- Frontend-ready validation layer

---

## 6. Phase 3 – Parser Layer

### Goal
Convert JSON specification into typed models.

### Tasks
- [ ] Load JSON spec from file or stdin
- [ ] Validate spec against schema
- [ ] Parse JSON into TypeScript models
- [ ] Normalize optional fields
- [ ] Attach source metadata (file, path, line if possible)

### Output
- RawSpecModel (typed, validated, untransformed)

---

## 7. Phase 4 – Intermediate Representation (IR) [DONE]

### Goal
Create a resolved, framework-neutral model.

### Tasks
- [ ] Define IR models:
  - ApplicationIR
  - FeatureIR
  - EntityIR
  - FieldIR
  - MethodIR
  - EndpointIR
  - SecurityRuleIR
- [ ] Resolve:
  - Entity relationships
  - Method references
  - Default values
- [ ] Ensure IR contains no nulls or ambiguities

### Output
- Fully resolved, normalized IR

---

## 8. Phase 5 – Transformer Pipeline [DONE]

### Goal
Incrementally enrich IR with Spring-aware semantics.

### Tasks
- [ ] Implement transformer interface
- [ ] Entity transformer:
  - ID strategy
  - Relationship ownership
  - JPA metadata
- [ ] Repository transformer:
  - Method naming
  - Return types
  - Pagination flags
- [ ] Service transformer:
  - Transactions
  - Exception strategy
- [ ] Controller transformer:
  - REST mappings
  - Request/response handling
- [ ] Security transformer:
  - Role resolution
  - Method-level access rules

### Output
- Spring-aware IR ready for generation

---

## 9. Phase 6 – Code Generation

### Goal
Generate readable Spring Boot source code.

### Tasks
- [ ] Choose templating strategy (string templates or engine)
- [ ] Implement generators:
  - EntityGenerator [DONE]
  - RepositoryGenerator [DONE]
  - ServiceGenerator
  - ControllerGenerator
  - SecurityGenerator
- [ ] Generate package structure
- [ ] Write files to disk safely
- [ ] Support overwrite strategy

### Output
- Compilable Spring Boot project structure

---

## 10. Phase 7 – CLI Interface

### Goal
Make the tool usable from command line.

### Tasks
- [ ] CLI argument parsing
- [ ] Commands:
  - generate
  - validate
  - inspect
- [ ] Configurable output directory
- [ ] Clear logging and error reporting

### Output
- Usable CLI tool

---

## 11. Phase 8 – Testing Strategy

### Tasks
- [ ] Unit tests for:
  - Parser
  - Validators
  - Transformers
- [ ] Snapshot tests for generated code
- [ ] End-to-end test:
  - Spec → Spring Boot output

### Output
- Confidence in deterministic generation

---

## 12. Phase 9 – Documentation

### Tasks
- [ ] Document specification format
- [ ] Add example specs
- [ ] Add generation examples
- [ ] Explain extension points

### Output
- Production-quality documentation

---

## 13. Phase 10 – Future Extensions (Post-v1)

Planned but not part of v1:
- DTO generation
- MapStruct mappers
- OpenAPI generation
- Auditing fields
- Soft delete
- Multi-tenancy
- Plugin system

---

## 14. Definition of Done (v1)

- [ ] Valid JSON spec produces Spring Boot API
- [ ] Generated code compiles
- [ ] CRUD operations work
- [ ] Security rules enforced
- [ ] CLI usable
- [ ] No runtime errors

---

## 15. Summary

This plan provides:
- Clear milestones
- Trackable progress
- Strong typing from spec to code
- Clean separation of responsibilities

Once Phase 1 is complete, the system becomes incrementally usable.

---

## Next Step

Start with **Phase 1: Specification Model** and lock it down.
Once frozen, all other layers build safely on top of it.
