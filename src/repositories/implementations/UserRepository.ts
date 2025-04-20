import { User } from '../../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { prisma } from '../../database/prismaClient';
import bcrypt from 'bcryptjs';

export class UserRepository implements IUserRepository {
    async findAll(): Promise<User[]> {
        return await prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
    }

    async findById(id: number): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true
            }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password as string, 10);
        return await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            } as any,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true
            }
        });
    }

    async update(id: number, userData: Partial<User>): Promise<User | null> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await prisma.user.update({
            where: { id },
            data: userData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true
            }
        });
    }

    async delete(id: number): Promise<boolean> {
        const user = await prisma.user.delete({
            where: { id }
        });
        return !!user;
    }

    async toggleStatus(id: number): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;

        return await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true
            }
        });
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
    }
} 