import { UserService } from '../../user/services/user.service.js';
import { UserRepository } from '../../user/repository/user.repository.js';
import { User, UserCreateRequest } from '../../user/models/user.model.js';

// Mock the UserRepository
jest.mock('../../user/repository/user.repository.js');

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create a mock UserRepository instance
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;

        // Create UserService with the mock repository
        userService = new UserService(mockUserRepository);
    });

    describe('createUser', () => {
        test('should call repository.createUser with the correct parameters', async () => {
            // Setup
            const userRequest: UserCreateRequest = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const expectedUser: User = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password_hash: 'hashed_password'
            };

            // Mock the repository method
            mockUserRepository.createUser = jest.fn().mockResolvedValue(expectedUser);

            // Execute
            const result = await userService.createUser(userRequest);

            // Verify
            expect(mockUserRepository.createUser).toHaveBeenCalledWith(userRequest);
            expect(result).toEqual(expectedUser);
        });
    });

    describe('getUserById', () => {
        test('should call repository.getUserById with the correct id', async () => {
            // Setup
            const userId = 1;
            const expectedUser: User = {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                password_hash: 'hashed_password'
            };

            // Mock the repository method
            mockUserRepository.getUserById = jest.fn().mockResolvedValue(expectedUser);

            // Execute
            const result = await userService.getUserById(userId);

            // Verify
            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedUser);
        });

        test('should return null when user is not found', async () => {
            // Setup
            const userId = 999;

            // Mock the repository method
            mockUserRepository.getUserById = jest.fn().mockResolvedValue(null);

            // Execute
            const result = await userService.getUserById(userId);

            // Verify
            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
            expect(result).toBeNull();
        });
    });

    describe('updateUser', () => {
        test('should call repository.updateUser with the correct parameters', async () => {
            // Setup
            const userId = 1;
            const userUpdate: User = {
                id: userId,
                name: 'Updated User',
                email: 'updated@example.com',
                password_hash: 'updated_hash'
            };

            // Mock the repository method
            mockUserRepository.updateUser = jest.fn().mockResolvedValue(userUpdate);

            // Execute
            const result = await userService.updateUser(userId, userUpdate);

            // Verify
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, userUpdate);
            expect(result).toEqual(userUpdate);
        });

        test('should return null when user is not found', async () => {
            // Setup
            const userId = 999;
            const userUpdate: User = {
                id: userId,
                name: 'Updated User',
                email: 'updated@example.com',
                password_hash: 'updated_hash'
            };

            // Mock the repository method
            mockUserRepository.updateUser = jest.fn().mockResolvedValue(null);

            // Execute
            const result = await userService.updateUser(userId, userUpdate);

            // Verify
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, userUpdate);
            expect(result).toBeNull();
        });
    });

    describe('deleteUser', () => {
        test('should call repository.deleteUser with the correct id', async () => {
            // Setup
            const userId = 1;

            // Mock the repository method
            mockUserRepository.deleteUser = jest.fn().mockResolvedValue(true);

            // Execute
            const result = await userService.deleteUser(userId);

            // Verify
            expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
            expect(result).toBe(true);
        });

        test('should return false when user is not found', async () => {
            // Setup
            const userId = 999;

            // Mock the repository method
            mockUserRepository.deleteUser = jest.fn().mockResolvedValue(false);

            // Execute
            const result = await userService.deleteUser(userId);

            // Verify
            expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
            expect(result).toBe(false);
        });
    });

    describe('getAllUsers', () => {
        test('should call repository.getAllUsers', async () => {
            // Setup
            const expectedUsers: User[] = [
                { id: 1, name: 'User 1', email: 'user1@example.com', password_hash: 'hash1' },
                { id: 2, name: 'User 2', email: 'user2@example.com', password_hash: 'hash2' }
            ];

            // Mock the repository method
            mockUserRepository.getAllUsers = jest.fn().mockResolvedValue(expectedUsers);

            // Execute
            const result = await userService.getAllUsers();

            // Verify
            expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
            expect(result).toEqual(expectedUsers);
        });
    });
});
