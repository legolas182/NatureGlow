import { CategoryRepository } from '../repositories/implementations/CategoryRepository';
import { prisma } from '../database/prismaClient';

jest.mock('../database/prismaClient', () => ({
    prisma: {
        category: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }
}));

describe('CategoryRepository', () => {
    let repository: CategoryRepository;
    const mockCategory = {
        id: 1,
        name: 'Cuidado Facial',
        type: 'facial',
        description: 'Productos para el cuidado de la piel facial',
        isActive: true,
        products: [
            {
                id: 1,
                name: 'Crema Hidratante'
            }
        ]
    };

    beforeEach(() => {
        repository = new CategoryRepository();
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all active categories', async () => {
            (prisma.category.findMany as jest.Mock).mockResolvedValue([mockCategory]);
            
            const categories = await repository.findAll();
            
            expect(categories).toHaveLength(1);
            expect(categories[0]).toEqual(mockCategory);
            expect(prisma.category.findMany).toHaveBeenCalledWith({
                where: { isActive: true }
            });
        });
    });

    describe('findWithProducts', () => {
        it('should return all categories with their products', async () => {
            (prisma.category.findMany as jest.Mock).mockResolvedValue([mockCategory]);
            
            const categories = await repository.findWithProducts();
            
            expect(categories).toHaveLength(1);
            expect(categories[0].products).toBeDefined();
            expect(categories[0].products[0].name).toBe('Crema Hidratante');
        });
    });

    describe('toggleStatus', () => {
        it('should toggle category status', async () => {
            const updatedCategory = { ...mockCategory, isActive: false };
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
            (prisma.category.update as jest.Mock).mockResolvedValue(updatedCategory);
            
            const category = await repository.toggleStatus(1);
            
            expect(category?.isActive).toBe(false);
            expect(prisma.category.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { isActive: false }
            });
        });
    });
}); 