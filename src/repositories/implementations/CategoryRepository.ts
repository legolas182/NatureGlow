import { Category } from '../../models/Category';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { prisma } from '../../database/prismaClient';

export class CategoryRepository implements ICategoryRepository {
    async findAll(): Promise<Category[]> {
        return await prisma.category.findMany({
            where: { isActive: true }
        });
    }

    async findById(id: number): Promise<Category | null> {
        return await prisma.category.findUnique({
            where: { id }
        });
    }

    async create(categoryData: Partial<Category>): Promise<Category> {
        return await prisma.category.create({
            data: categoryData as any
        });
    }

    async update(id: number, categoryData: Partial<Category>): Promise<Category | null> {
        return await prisma.category.update({
            where: { id },
            data: categoryData
        });
    }

    async delete(id: number): Promise<boolean> {
        const category = await prisma.category.delete({
            where: { id }
        });
        return !!category;
    }

    async findWithProducts(): Promise<Category[]> {
        return await prisma.category.findMany({
            where: { isActive: true },
            include: {
                products: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async toggleStatus(id: number): Promise<Category | null> {
        const category = await this.findById(id);
        if (!category) return null;

        return await prisma.category.update({
            where: { id },
            data: { isActive: !category.isActive }
        });
    }
} 