# Dummy Todo App – Implementation Plan

## Project Overview

The Dummy Todo App is a minimal, extensible backend system designed as a blank canvas for experimenting with different integration strategies for conversational AI agents, as described in the main article. The goal is to provide a realistic, but simple, multi-entity application that can be easily adapted for ORM-based, OpenAPI/Swagger-based, and direct database integration approaches. The app will serve as a common foundation for all experiments, ensuring fair comparison and easy extensibility.

### Key Principles
- **Blank Canvas:** The app will not include any business logic or features beyond basic CRUD and relationship management for users, teams, and tasks. This ensures it can be easily extended or adapted for each integration approach.
- **Modular Structure:** All components (models, routes, controllers, config) will be organized by domain for clarity and easy replacement or extension.
- **Integration-Ready:** The app will include all necessary hooks for ORM, OpenAPI/Swagger, and direct DB access, but will not be opinionated about which is used—this will be determined by the integration experiment.
- **Seed Data:** The app will include scripts to seed the database with realistic but minimal data for testing and demonstration.

---

## Example Project as Reference

The **example-project** serves as the reference for all code structure, conventions, and best practices. The dummy todo app **must follow** its patterns for:

- **Project structure:**  
  Use a `src/` directory with subfolders for `<domain>/`, `config/`, and `tests/`. Organize code into `routes/`, `controllers/`, and `validators/` within each domain (e.g., `src/<domain>/`).
- **Server setup:**  
  Use a single entry point (e.g., `src/server.ts`) that loads configuration, sets up Express, and registers routes. Include a health check route (e.g., `/alive`). Use centralized error handling middleware.
- **Controllers and routes:**  
  Implement controllers as classes, instantiated with dependencies (e.g., config managers). Register routes in dedicated files, importing controllers and wiring up endpoints.
- **Validation:**  
  Use `express-validator` for request validation, with validators defined in separate files.
- **Constants:**  
  Store reusable constants in a dedicated file (e.g., `app-constants.ts`).
- **Testing:**  
  Use Jest and Supertest for unit and integration tests, with tests organized under `src/tests/`.
- **TypeScript:**  
  Use TypeScript throughout, with strict typing and clear interfaces.

All new code and structure in the dummy todo app should be modeled after the example-project. This ensures consistency, maintainability, and ease of integration for all experimental approaches.

---

## 1. Define the Data Model

### Entities:
- **User**
  - id (PK)
  - name
  - email
  - password_hash (for realism, even if not used)
- **Team**
  - id (PK)
  - name
  - description
- **Task**
  - id (PK)
  - title
  - description
  - status (e.g., todo, in_progress, done)
  - due_date
  - team_id (FK to Team)
  - assigned_user_id (FK to User, nullable)

### Relationships:
- A **Team** has many **Users** (many-to-many)
- A **User** can belong to many **Teams** (many-to-many)
- A **Team** has many **Tasks**
- A **Task** can be assigned to a **User** (optional)

#### Join Table:
- **TeamUser**
  - user_id (FK)
  - team_id (FK)

---

## 2. Set Up the Project Structure

- `/src` — Main source directory
  - `/example-domain` — Domain logic (models, routes, controllers, validators)
    - `/models` — Sequelize models for User, Team, Task, TeamUser
    - `/routes` — Express routes for API endpoints
    - `/controllers` — Business logic for each resource
    - `/validators` — Request validation logic
  - `/<domain>`
    - `...`
  - `/config` — Database config, ConfigManager, environment setup
  - `/tests` — Basic tests for endpoints and DB queries
  - `app-constants.ts` — Shared constants
  - `server.ts` — Main entry point
- `/swagger` — OpenAPI spec (YAML or JSON)
- `/db` — SQL scripts for schema (for direct DB access)
- `/seeders` — Scripts for populating the database with dummy data
- `README.md` — Project documentation

---

## 3. Implement the Backend

### a. PostgreSQL
- Create the database and tables (matching the model above).
- Provide SQL scripts for schema creation and teardown.

### b. Sequelize ORM
- Define models and relationships in `src/<domain>/models/`.
- Sync models to the database.
- Provide migration scripts if needed.

### c. Express API
- Implement controllers as classes in `src/<domain>/controllers/`, following the example-project's dependency injection pattern.
- Define routes in `src/<domain>/routes/`, importing controllers and wiring up endpoints.
- Add request validation using `express-validator` in `src/<domain>/validators/`.
- CRUD endpoints for User, Team, Task.
- Endpoints for:
  - Adding/removing users to/from teams.
  - Assigning tasks to users.
  - Listing tasks by team, by user, by status.

### d. Swagger/OpenAPI
- Create OpenAPI spec in `/swagger`.
- Integrate Swagger UI with Express.
- Document all endpoints and schemas.
- Add authentication placeholder (even if not implemented).

### e. Direct DB Access
- Provide a module for running raw SQL queries (for analytics, e.g., "tasks due this week").
- Ensure queries are validated and sanitized.

---

## 4. Prepare for Integration Approaches

- **ORM Approach:** All business logic via Sequelize.
- **OpenAPI/MCP Approach:** All business logic via REST API, fully documented in Swagger.
- **Direct DB Approach:** Expose a way to run raw SQL queries (with validation/sanitization).

---

## 5. Testing & Dummy Data

- Seed the database with:
  - 2–3 teams
  - 4–5 users (some in multiple teams)
  - 6–10 tasks (various statuses, some assigned, some unassigned)
- Write basic tests for endpoints and DB queries in `src/tests/`.

---

## 6. Frontend (Optional for Now)
- Minimal React app with:
  - Login (optional)
  - List teams, users, tasks
  - Create/edit tasks
  - Assign users to teams/tasks

---

## 7. Documentation
- README with setup instructions.
- Example API calls.
- Example SQL queries for direct DB access.
- Clear instructions for extending the app for each integration approach.

---

## Summary Table (with Example Project Alignment)

| Component        | ORM Approach | OpenAPI/Swagger | Direct DB Access | Example Project Pattern |
| ---------------- | ------------ | --------------- | ---------------- | ----------------------- |
| Sequelize Models | Yes          | Yes             | Yes              | Yes                     |
| Express API      | Yes          | Yes             | Optional         | Yes                     |
| Swagger Spec     | Optional     | Yes             | Optional         | Yes                     |
| Raw SQL Module   | Optional     | Optional        | Yes              | Yes                     |
| Config Manager   | Yes          | Yes             | Yes              | Yes                     |
| Validators       | Yes          | Yes             | Yes              | Yes                     |
| Controllers      | Yes          | Yes             | Yes              | Yes                     |
| Tests            | Yes          | Yes             | Yes              | Yes                     |

---

This plan ensures the Dummy Todo App is a clean, extensible foundation for all integration experiments described in the article, and that it strictly follows the architecture and practices established in the example-project. All business logic and features should be kept minimal and generic to maximize reusability and comparability across integration approaches.
