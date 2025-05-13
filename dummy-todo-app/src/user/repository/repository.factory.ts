import { UserRepositoryInterface } from './user.repository.interface.js';
import { UserMemoryRepository } from './user.memory.repository.js';
import { UserRepository } from './user.repository.js';

export class RepositoryFactory {
    static createUserRepository(): UserRepositoryInterface {
        if (process.env.NODE_ENV === 'test') {
            return new UserMemoryRepository();
        }
        return new UserRepository();
    }
}
