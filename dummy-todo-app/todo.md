## Implementation To-Do List

### Project Setup
- [x] build the project using the example-project's structure (`src/`, `src/<domain>/`, `config/`, etc.).
- [x] Set up TypeScript, ESLint, Prettier, and Jest as in the example-project.
- [x] Add a health check route (`/alive`).

### Database & ORM
- [ ] Create PostgreSQL database and SQL schema scripts in `/db`.
- [ ] Define Sequelize models in `src/<domain>/models/`.
- [ ] Set up model relationships and migrations.

### API & Controllers
- [ ] Implement controllers as classes in `src/<domain>/controllers/`, following the example-project's dependency injection pattern.
- [ ] Define routes in `src/<domain>/routes/`, importing controllers and wiring up endpoints.
- [ ] Add request validation using `express-validator` in `src/<domain>/validators/`.
- [ ] Implement CRUD routes/controllers for User, Team, Task.
- [ ] Implement endpoints for team membership and task assignment.
- [ ] Implement endpoints for listing/filtering tasks.

### Configuration
- [x] Implement a `src/config/` for environment and app config, following the example-project's approach.

### Swagger/OpenAPI
- [ ] Create OpenAPI spec in `/swagger`.
- [ ] Integrate Swagger UI with Express.
- [ ] Document all endpoints and schemas.

### Direct DB Access
- [ ] Implement module for running raw SQL queries.
- [ ] Add example analytics/reporting queries.

### Seed & Test Data
- [ ] Write seed scripts for dummy data in `/seeders`.
- [ ] Add Jest/Supertest tests in `src/tests/`.

### Documentation
- [ ] Write README with setup, usage, and extension instructions.
- [ ] Add example API calls and SQL queries.
