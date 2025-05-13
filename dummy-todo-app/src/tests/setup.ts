import sequelize from '../config/database.js';
import { UserModel } from '../user/models/user.model.js';

// Initialize test database (in-memory SQLite)
beforeAll(async () => {
    // Sync models with the database
    await sequelize.sync({ force: true });
});

// Clear tables after each test
afterEach(async () => {
    await UserModel.destroy({ where: {}, truncate: true });
});

// Close database connection after all tests
afterAll(async () => {
    await sequelize.close();
});
