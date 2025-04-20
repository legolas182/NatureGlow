import { UserRepository } from '../repositories/implementations/UserRepository';
import { prisma } from '../database/prismaClient';
import bcrypt from 'bcryptjs';
import { mockPrisma } from './utils/testHelpers';

jest.mock('../database/prismaClient', () => ({
    prisma: mockPrisma
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

describe('UserRepository', () => {
    let repository: UserRepository;
    const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedPassword123',
        role: 'user',
        isActive: true,
        createdAt: new Date()
    };

    beforeEach(() => {
        repository = new UserRepository();
        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            
            const user = await repository.findByEmail('test@test.com');
            
            expect(user).toEqual(mockUser);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@test.com' }
            });
        });
    });

    describe('create', () => {
        it('should create a new user with hashed password', async () => {
            const userData = {
                name: 'New User',
                email: 'new@test.com',
                password: 'password123',
                role: 'user'
            };
            
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue({
                ...userData,
                id: 2,
                isActive: true,
                password: 'hashedPassword'
            });
            
            const user = await repository.create(userData);
            
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(user.password).toBeUndefined(); // Password should not be returned
            expect(user.id).toBe(2);
        });
    });

    describe('validatePassword', () => {
        it('should return true for valid password', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            
            const isValid = await repository.validatePassword(mockUser, 'correctPassword');
            
            expect(isValid).toBe(true);
            expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword123');
        });

        it('should return false for invalid password', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            
            const isValid = await repository.validatePassword(mockUser, 'wrongPassword');
            
            expect(isValid).toBe(false);
        });
    });
}); 