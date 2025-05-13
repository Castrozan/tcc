import { User } from '../models/user.model.js';
import { UserCreateRequest } from '../models/user.model.js';
import { UserRepositoryInterface } from './user.repository.interface.js';

export class UserMemoryRepository implements UserRepositoryInterface {
    // Use instance variables instead of module-level variables for better testability
    private users: User[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com', password_hash: 'hash1' },
        { id: 2, name: 'Bob', email: 'bob@example.com', password_hash: 'hash2' }
    ];
    private nextId = 3;

    constructor() {}

    async createUser(user: UserCreateRequest): Promise<User> {
        const newUser: User = {
            id: this.nextId++,
            name: user.name,
            email: user.email,
            password_hash: `mockhash_${user.password}`
        };
        this.users.push(newUser);
        return newUser;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        return user || null;
    }

    async updateUser(id: number, user: User): Promise<User | null> {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            return null;
        }

        const updatedUser = {
            ...user,
            id: id
        };

        this.users[index] = updatedUser;
        return updatedUser;
    }

    async deleteUser(id: number): Promise<boolean> {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            return false;
        }
        this.users.splice(index, 1);
        return true;
    }

    async getAllUsers(): Promise<User[]> {
        return this.users;
    }
}
