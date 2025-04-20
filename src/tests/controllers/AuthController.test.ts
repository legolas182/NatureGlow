import { Request, Response } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { UserRepository } from '../../repositories/implementations/UserRepository';
import jwt from 'jsonwebtoken';
import { createMockRequest, createMockResponse } from '../utils/testHelpers';

jest.mock('../../repositories/implementations/UserRepository');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let controller: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        controller = new AuthController(mockUserRepository);
        mockRequest = createMockRequest();
        mockResponse = createMockResponse();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: 'test@test.com',
                password: 'password123'
            };
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                password: 'hashedPassword',
                name: 'Test User',
                role: 'user'
            };
            mockRequest.body = loginData;
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockUserRepository.validatePassword.mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mock_token');

            await controller.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Login exitoso',
                token: 'mock_token',
                user: expect.objectContaining({
                    id: 1,
                    email: 'test@test.com',
                    name: 'Test User',
                    role: 'user'
                })
            });
        });

        it('should return 401 with incorrect password', async () => {
            const loginData = {
                email: 'test@test.com',
                password: 'wrongpassword'
            };
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                password: 'hashedPassword',
                name: 'Test User',
                role: 'user'
            };
            mockRequest.body = loginData;
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockUserRepository.validatePassword.mockResolvedValue(false);

            await controller.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Credenciales inválidas'
            });
        });

        it('should return 404 for non-existent user', async () => {
            mockRequest.body = {
                email: 'nonexistent@test.com',
                password: 'password123'
            };
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await controller.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Usuario no encontrado'
            });
        });
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerData = {
                name: 'New User',
                email: 'new@test.com',
                password: 'password123'
            };
            const createdUser = {
                id: 1,
                ...registerData,
                role: 'user'
            };
            mockRequest.body = registerData;
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(createdUser);
            (jwt.sign as jest.Mock).mockReturnValue('mock_token');

            await controller.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Usuario registrado exitosamente',
                token: 'mock_token',
                user: createdUser
            });
        });

        it('should return 400 if email already exists', async () => {
            mockRequest.body = {
                name: 'New User',
                email: 'existing@test.com',
                password: 'password123'
            };
            mockUserRepository.findByEmail.mockResolvedValue({ id: 1 } as any);

            await controller.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'El email ya está registrado'
            });
        });
    });
}); 