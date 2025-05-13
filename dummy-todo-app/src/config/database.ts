import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo_db';

// For test environment, use in-memory SQLite
const isTest = process.env.NODE_ENV === 'test';

const sequelize = isTest
    ? new Sequelize({
          dialect: 'sqlite',
          storage: ':memory:',
          logging: false
      })
    : new Sequelize(databaseUrl, {
          logging: process.env.NODE_ENV === 'development'
      });

// Initialize database - sync all models
export async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');

        // Sync all models with the database
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default sequelize;
