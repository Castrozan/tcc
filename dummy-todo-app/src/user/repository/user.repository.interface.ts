import { User } from '../models/user.model.js';
import { UserCreateRequest } from '../models/user.model.js';

export interface UserRepositoryInterface {
    createUser(user: UserCreateRequest): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    updateUser(id: number, user: User): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
}
