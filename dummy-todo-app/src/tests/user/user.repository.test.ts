import { UserMemoryRepository } from '../../user/repository/user.memory.repository.js';
import { User, UserCreateRequest } from '../../user/models/user.model.js';

describe('UserRepository', () => {
    let userRepository: UserMemoryRepository;

    beforeEach(() => {
        userRepository = new UserMemoryRepository();
        // Reset users in the repository to ensure test isolation
        // This is possible because we can access the private variable with TypeScript type assertion
        (userRepository as any).users = [
            { id: 1, name: 'Test User 1', email: 'test1@example.com', password_hash: 'hash1' },
            { id: 2, name: 'Test User 2', email: 'test2@example.com', password_hash: 'hash2' }
        ];
        (userRepository as any).nextId = 3;
    });

    describe('createUser', () => {
        test('should create a new user with incremented ID', async () => {
            const userRequest: UserCreateRequest = {
                name: 'New User',
                email: 'new@example.com',
                password: 'password123'
            };

            const createdUser = await userRepository.createUser(userRequest);

            expect(createdUser).toEqual(
                expect.objectContaining({
                    id: 3,
                    name: 'New User',
                    email: 'new@example.com',
                    password_hash: expect.stringContaining('mockhash_')
                })
            );

            // Verify user was added to the repository
            const allUsers = await userRepository.getAllUsers();
            expect(allUsers.length).toBe(3);
            expect(allUsers[2]).toEqual(createdUser);
        });

        test('should hash the password', async () => {
            const userRequest: UserCreateRequest = {
                name: 'Password Test',
                email: 'password@example.com',
                password: 'test_password'
            };

            const createdUser = await userRepository.createUser(userRequest);

            expect(createdUser.password_hash).toBe('mockhash_test_password');
            expect(createdUser).not.toHaveProperty('password');
        });
    });

    describe('getUserById', () => {
        test('should return user by ID when found', async () => {
            const user = await userRepository.getUserById(1);

            expect(user).toEqual({
                id: 1,
                name: 'Test User 1',
                email: 'test1@example.com',
                password_hash: 'hash1'
            });
        });

        test('should return null when user is not found', async () => {
            const user = await userRepository.getUserById(999);

            expect(user).toBeNull();
        });
    });

    describe('updateUser', () => {
        test('should update existing user', async () => {
            const updatedUser: User = {
                id: 1,
                name: 'Updated Name',
                email: 'updated@example.com',
                password_hash: 'updated_hash'
            };

            const result = await userRepository.updateUser(1, updatedUser);

            expect(result).toEqual(updatedUser);

            // Verify user was updated in the repository
            const user = await userRepository.getUserById(1);
            expect(user).toEqual(updatedUser);
        });

        test('should return null when updating non-existent user', async () => {
            const nonExistentUser: User = {
                id: 999,
                name: 'Non-existent',
                email: 'nonexistent@example.com',
                password_hash: 'hash'
            };

            const result = await userRepository.updateUser(999, nonExistentUser);

            expect(result).toBeNull();
        });

        test('should preserve the specified ID', async () => {
            const userWithDifferentId: User = {
                id: 999, // Different from the target ID
                name: 'Updated Name',
                email: 'updated@example.com',
                password_hash: 'updated_hash'
            };

            const result = await userRepository.updateUser(1, userWithDifferentId);

            expect(result?.id).toBe(1); // ID should be preserved
            expect(result?.name).toBe('Updated Name');
        });
    });

    describe('deleteUser', () => {
        test('should delete existing user', async () => {
            const result = await userRepository.deleteUser(1);

            expect(result).toBe(true);

            // Verify user was removed from the repository
            const user = await userRepository.getUserById(1);
            expect(user).toBeNull();

            // Verify total count is reduced
            const allUsers = await userRepository.getAllUsers();
            expect(allUsers.length).toBe(1);
        });

        test('should return false when deleting non-existent user', async () => {
            const result = await userRepository.deleteUser(999);

            expect(result).toBe(false);

            // Verify no users were removed
            const allUsers = await userRepository.getAllUsers();
            expect(allUsers.length).toBe(2);
        });
    });

    describe('getAllUsers', () => {
        test('should return all users', async () => {
            const users = await userRepository.getAllUsers();

            expect(users).toHaveLength(2);
            expect(users[0].id).toBe(1);
            expect(users[1].id).toBe(2);
        });
    });
});
