import { UserController } from '../../user/controllers/user.controller.js';
import { UserService } from '../../user/services/user.service.js';
import { UserValidators } from '../../user/validators/user.validators.js';
import { User, UserCreateRequest } from '../../user/models/user.model.js';
import { UserRepositoryInterface } from '../../user/repository/user.repository.interface.js';
import { Request, Response } from 'express';

// Mock dependencies
jest.mock('../../user/services/user.service.js');
jest.mock('../../user/validators/user.validators.js');

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: jest.Mocked<UserService>;
    let mockUserRepository: UserRepositoryInterface;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockJsonFn: jest.Mock;
    let mockStatusFn: jest.Mock;
    let mockSendFn: jest.Mock;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mock response functions
        mockJsonFn = jest.fn();
        mockSendFn = jest.fn();
        mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn, send: mockSendFn });

        // Create mock request and response
        mockReq = {};
        mockRes = {
            status: mockStatusFn,
            json: mockJsonFn,
            send: mockSendFn
        };

        // Set up mock repository and service
        mockUserRepository = {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getAllUsers: jest.fn()
        };
        mockUserService = new UserService(mockUserRepository) as jest.Mocked<UserService>;

        // Create controller with mock service
        userController = new UserController(mockUserService);

        // Mock UserValidators methods to resolve successfully by default
        (UserValidators.verifyCreateUser as jest.Mock).mockResolvedValue(undefined);
        (UserValidators.verifyGetUser as jest.Mock).mockResolvedValue(undefined);
        (UserValidators.verifyUpdateUser as jest.Mock).mockResolvedValue(undefined);
        (UserValidators.verifyDeleteUser as jest.Mock).mockResolvedValue(undefined);
    });

    describe('createUser', () => {
        test('should create a user and return 201 status', async () => {
            // Setup
            const userRequest: UserCreateRequest = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const createdUser: User = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password_hash: 'hashed_password'
            };

            mockReq.body = userRequest;
            mockUserService.createUser.mockResolvedValue(createdUser);

            // Execute
            await userController.createUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyCreateUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.createUser).toHaveBeenCalledWith(userRequest);
            expect(mockStatusFn).toHaveBeenCalledWith(201);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: true,
                user: createdUser
            });
        });
    });

    describe('getUser', () => {
        test('should return user when found', async () => {
            // Setup
            const userId = 1;
            const user: User = {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                password_hash: 'hashed_password'
            };

            mockReq.params = { id: userId.toString() };
            mockUserService.getUserById.mockResolvedValue(user);

            // Execute
            await userController.getUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyGetUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
            expect(mockStatusFn).toHaveBeenCalledWith(200);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: true,
                user
            });
        });

        test('should return 404 when user not found', async () => {
            // Setup
            const userId = 999;

            mockReq.params = { id: userId.toString() };
            mockUserService.getUserById.mockResolvedValue(null);

            // Execute
            await userController.getUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyGetUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
            expect(mockStatusFn).toHaveBeenCalledWith(404);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });
    });

    describe('updateUser', () => {
        test('should update user and return 200 status', async () => {
            // Setup
            const userId = 1;
            const userUpdate: User = {
                id: userId,
                name: 'Updated User',
                email: 'updated@example.com',
                password_hash: 'updated_hash'
            };

            mockReq.params = { id: userId.toString() };
            mockReq.body = userUpdate;
            mockUserService.updateUser.mockResolvedValue(userUpdate);

            // Execute
            await userController.updateUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyUpdateUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, userUpdate);
            expect(mockStatusFn).toHaveBeenCalledWith(200);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: true,
                user: userUpdate
            });
        });

        test('should return 404 when user not found', async () => {
            // Setup
            const userId = 999;
            const userUpdate: User = {
                id: userId,
                name: 'Updated User',
                email: 'updated@example.com',
                password_hash: 'updated_hash'
            };

            mockReq.params = { id: userId.toString() };
            mockReq.body = userUpdate;
            mockUserService.updateUser.mockResolvedValue(null);

            // Execute
            await userController.updateUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyUpdateUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, userUpdate);
            expect(mockStatusFn).toHaveBeenCalledWith(404);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });
    });

    describe('deleteUser', () => {
        test('should delete user and return 204 status', async () => {
            // Setup
            const userId = 1;

            mockReq.params = { id: userId.toString() };
            mockUserService.deleteUser.mockResolvedValue(true);

            // Execute
            await userController.deleteUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyDeleteUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
            expect(mockStatusFn).toHaveBeenCalledWith(204);
            expect(mockSendFn).toHaveBeenCalled();
        });

        test('should return 404 when user not found', async () => {
            // Setup
            const userId = 999;

            mockReq.params = { id: userId.toString() };
            mockUserService.deleteUser.mockResolvedValue(false);

            // Execute
            await userController.deleteUser(mockReq as Request, mockRes as Response);

            // Verify
            expect(UserValidators.verifyDeleteUser).toHaveBeenCalledWith(mockReq);
            expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
            expect(mockStatusFn).toHaveBeenCalledWith(404);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });
    });

    describe('listUsers', () => {
        test('should return all users', async () => {
            // Setup
            const users: User[] = [
                { id: 1, name: 'User 1', email: 'user1@example.com', password_hash: 'hash1' },
                { id: 2, name: 'User 2', email: 'user2@example.com', password_hash: 'hash2' }
            ];

            mockUserService.getAllUsers.mockResolvedValue(users);

            // Execute
            await userController.listUsers(mockReq as Request, mockRes as Response);

            // Verify
            expect(mockUserService.getAllUsers).toHaveBeenCalled();
            expect(mockStatusFn).toHaveBeenCalledWith(200);
            expect(mockJsonFn).toHaveBeenCalledWith({
                success: true,
                users
            });
        });
    });
});
