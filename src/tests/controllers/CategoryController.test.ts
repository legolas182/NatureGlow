import { Request, Response } from 'express';
import { CategoryController } from '../../controllers/CategoryController';
import { CategoryRepository } from '../../repositories/implementations/CategoryRepository';

jest.mock('../../repositories/implementations/CategoryRepository');

describe('CategoryController', () => {
    let controller: CategoryController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockCategoryRepository: jest.Mocked<CategoryRepository>;

    beforeEach(() => {
        mockCategoryRepository = new CategoryRepository() as jest.Mocked<CategoryRepository>;
        controller = new CategoryController(mockCategoryRepository);
        mockRequest = {
            body: {},
            params: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all active categories', async () => {
            const mockCategories = [
                { id: 1, name: 'Category 1', isActive: true },
                { id: 2, name: 'Category 2', isActive: true }
            ];
            mockCategoryRepository.findAll.mockResolvedValue(mockCategories);

            await controller.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categorías obtenidas exitosamente',
                categories: mockCategories
            });
        });

        it('should handle errors when finding categories', async () => {
            mockCategoryRepository.findAll.mockRejectedValue(new Error('Database error'));

            await controller.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error al obtener las categorías'
            });
        });
    });

    describe('findById', () => {
        it('should return a category by id', async () => {
            const mockCategory = { id: 1, name: 'Category 1', isActive: true };
            mockRequest.params = { id: '1' };
            mockCategoryRepository.findById.mockResolvedValue(mockCategory);

            await controller.findById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categoría obtenida exitosamente',
                category: mockCategory
            });
        });

        it('should return 404 when category is not found', async () => {
            mockRequest.params = { id: '999' };
            mockCategoryRepository.findById.mockResolvedValue(null);

            await controller.findById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categoría no encontrada'
            });
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const categoryData = { name: 'New Category' };
            const createdCategory = { id: 1, ...categoryData, isActive: true };
            mockRequest.body = categoryData;
            mockCategoryRepository.create.mockResolvedValue(createdCategory);

            await controller.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categoría creada exitosamente',
                category: createdCategory
            });
        });
    });

    describe('update', () => {
        it('should update an existing category', async () => {
            const categoryData = { name: 'Updated Category' };
            const updatedCategory = { id: 1, ...categoryData, isActive: true };
            mockRequest.params = { id: '1' };
            mockRequest.body = categoryData;
            mockCategoryRepository.findById.mockResolvedValue({ id: 1, name: 'Old Name', isActive: true });
            mockCategoryRepository.update.mockResolvedValue(updatedCategory);

            await controller.update(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categoría actualizada exitosamente',
                category: updatedCategory
            });
        });

        it('should return 404 when updating non-existent category', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { name: 'Updated Category' };
            mockCategoryRepository.findById.mockResolvedValue(null);

            await controller.update(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categoría no encontrada'
            });
        });
    });

    describe('toggleStatus', () => {
        it('should toggle category status', async () => {
            const mockCategory = { id: 1, name: 'Category 1', isActive: false };
            mockRequest.params = { id: '1' };
            mockCategoryRepository.findById.mockResolvedValue({ ...mockCategory, isActive: true });
            mockCategoryRepository.toggleStatus.mockResolvedValue(mockCategory);

            await controller.toggleStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Estado de la categoría actualizado exitosamente',
                category: mockCategory
            });
        });

        it('should return 404 when toggling non-existent category', async () => {
            mockRequest.params = { id: '999' };
            mockCategoryRepository.findById.mockResolvedValue(null);

            await controller.toggleStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Categoría no encontrada'
            });
        });
    });
}); 