import { ProductRepository } from '../repositories/implementations/ProductRepository';
import { prisma } from '../database/prismaClient';

// Mock de Prisma
jest.mock('../database/prismaClient', () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }
}));

describe('ProductRepository', () => {
    let repository: ProductRepository;
    const mockProduct = {
        id: 1,
        name: 'Crema Hidratante',
        description: 'Crema hidratante para todo tipo de piel',
        price: 29.99,
        stock: 100,
        categoryId: 1,
        isActive: true,
        brand: 'Nature Grow',
        category: {
            id: 1,
            name: 'Cuidado Facial'
        }
    };

    beforeEach(() => {
        repository = new ProductRepository();
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all active products', async () => {
            (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);
            
            const products = await repository.findAll();
            
            expect(products).toHaveLength(1);
            expect(products[0]).toEqual(mockProduct);
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                where: { isActive: true },
                include: { category: true }
            });
        });
    });

    describe('findById', () => {
        it('should return a product by id', async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
            
            const product = await repository.findById(1);
            
            expect(product).toEqual(mockProduct);
            expect(prisma.product.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { category: true }
            });
        });

        it('should return null for non-existent product', async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
            
            const product = await repository.findById(999);
            
            expect(product).toBeNull();
        });
    });

    describe('updateStock', () => {
        it('should update product stock', async () => {
            const updatedProduct = { ...mockProduct, stock: 150 };
            (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);
            
            const product = await repository.updateStock(1, 150);
            
            expect(product).toEqual(updatedProduct);
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { stock: 150 },
                include: { category: true }
            });
        });
    });
}); 