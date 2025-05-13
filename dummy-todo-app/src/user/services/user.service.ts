import { UserCreateRequest, User } from '../models/user.model.js';
import { UserRepositoryInterface } from '../repository/user.repository.interface.js';

export class UserService {
    constructor(private readonly userRepository: UserRepositoryInterface) {}

    async createUser(user: UserCreateRequest): Promise<User> {
        return this.userRepository.createUser(user);
    }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepository.getUserById(id);
    }

    async updateUser(id: number, user: User): Promise<User | null> {
        return this.userRepository.updateUser(id, user);
    }

    async deleteUser(id: number): Promise<boolean> {
        return this.userRepository.deleteUser(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}
