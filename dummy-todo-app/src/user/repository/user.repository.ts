import { User, UserModel, UserCreateRequest } from '../models/user.model.js';
import { UserRepositoryInterface } from './user.repository.interface.js';
import bcrypt from 'bcrypt';

export class UserRepository implements UserRepositoryInterface {
    private readonly SALT_ROUNDS = 10;

    constructor() {}

    async createUser(user: UserCreateRequest): Promise<User> {
        const passwordHash = await bcrypt.hash(user.password, this.SALT_ROUNDS);

        const newUser = await UserModel.create({
            name: user.name,
            email: user.email,
            password_hash: passwordHash
        });

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password_hash: newUser.password_hash
        };
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await UserModel.findByPk(id);
        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password_hash: user.password_hash
        };
    }

    async updateUser(id: number, userData: User): Promise<User | null> {
        const user = await UserModel.findByPk(id);
        if (!user) {
            return null;
        }

        await user.update({
            name: userData.name,
            email: userData.email,
            password_hash: userData.password_hash
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password_hash: user.password_hash
        };
    }

    async deleteUser(id: number): Promise<boolean> {
        const deleted = await UserModel.destroy({
            where: { id }
        });

        return deleted > 0;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await UserModel.findAll();

        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password_hash: user.password_hash
        }));
    }
}
