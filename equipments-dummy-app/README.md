# Equipments Dummy App

This is a RESTful API for a todo application that uses PostgreSQL as a database and Sequelize as an ORM.

## Funcionalidades

O Equipments Dummy App oferece um conjunto de funcionalidades essenciais para a administração de equipamentos de uma fábrica, incluindo:

Equipamentos: permite registrar e gerenciar informações sobre equipamentos disponíveis para uso na fabrica.

## Tecnologias

- REST com documentação OpenAPI
- Hono.js e TypeScript
- Sequelize com postgres

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create a .env file with the following content
PORT=3000
```

4. The database is automatically initialized when starting the application.

### Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Documentation

The app swagger documentation is available at the root endpoint (`/`) when the server is running.

## Project Structure

```
src/
├── application/     # Application services and use cases
├── domain/          # Domain models and interfaces
├── infrastructure/  # External services, database, web server
│   ├── database/    # Database implementation
│   └── web/         # Web server configuration
├── presentation/    # Controllers and DTOs
└── config/          # Application configuration
```

## Endpoints

The Equipments Dummy App provides the following endpoints:

- `/equipment` - Manage equipments

## License

This project is licensed under the MIT License - see the LICENSE file for details.
