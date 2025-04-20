import { Product } from '../../models/Product';
import { IProductRepository } from '../interfaces/IProductRepository';
import { prisma } from '../../database/prismaClient';

export class ProductRepository implements IProductRepository {
    async findAll(): Promise<Product[]> {
        return await prisma.product.findMany({
            where: { isActive: true },
            include: { category: true }
        });
    }

    async findById(id: number): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
    }

    async create(productData: Partial<Product>): Promise<Product> {
        return await prisma.product.create({
            data: productData as any,
            include: { category: true }
        });
    }

    async update(id: number, productData: Partial<Product>): Promise<Product | null> {
        return await prisma.product.update({
            where: { id },
            data: productData,
            include: { category: true }
        });
    }

    async delete(id: number): Promise<boolean> {
        const product = await prisma.product.delete({
            where: { id }
        });
        return !!product;
    }

    async updateStock(id: number, quantity: number): Promise<Product | null> {
        return await prisma.product.update({
            where: { id },
            data: { stock: quantity },
            include: { category: true }
        });
    }

    async toggleStatus(id: number): Promise<Product | null> {
        const product = await this.findById(id);
        if (!product) return null;

        return await prisma.product.update({
            where: { id },
            data: { isActive: !product.isActive },
            include: { category: true }
        });
    }
} 