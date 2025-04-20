import { Request, Response } from 'express';
import { ProductController } from '../../controllers/ProductController';
import { ProductRepository } from '../../repositories/implementations/ProductRepository';

jest.mock('../../repositories/implementations/ProductRepository');

describe('ProductController', () => {
    let controller: ProductController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockProductRepository: jest.Mocked<ProductRepository>;

    beforeEach(() => {
        mockProductRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
        controller = new ProductController(mockProductRepository);
        mockRequest = {
            params: {},
            body: {},
            user: { id: 1, role: 'admin' }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all active products', async () => {
            const mockProducts = [
                {
                    id: 1,
                    name: 'Crema Hidratante',
                    price: 29.99,
                    stock: 100
                }
            ];
            mockProductRepository.findAll.mockResolvedValue(mockProducts);

            await controller.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ products: mockProducts });
        });

        it('should handle errors', async () => {
            mockProductRepository.findAll.mockRejectedValue(new Error('Database error'));

            await controller.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error al obtener productos'
            });
        });
    });

    describe('updateStock', () => {
        it('should update product stock', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { quantity: 150 };
            const updatedProduct = {
                id: 1,
                name: 'Crema Hidratante',
                stock: 150
            };
            mockProductRepository.updateStock.mockResolvedValue(updatedProduct);

            await controller.updateStock(mockRequest as Request, mockResponse as Response);

            expect(mockProductRepository.updateStock).toHaveBeenCalledWith(1, 150);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct);
        });

        it('should handle non-existent product', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { quantity: 150 };
            mockProductRepository.updateStock.mockResolvedValue(null);

            await controller.updateStock(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Producto no encontrado'
            });
        });
    });

    describe('toggleStatus', () => {
        it('should toggle product status', async () => {
            mockRequest.params = { id: '1' };
            const updatedProduct = {
                id: 1,
                name: 'Crema Hidratante',
                isActive: false
            };
            mockProductRepository.toggleStatus.mockResolvedValue(updatedProduct);

            await controller.toggleStatus(mockRequest as Request, mockResponse as Response);

            expect(mockProductRepository.toggleStatus).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct);
        });
    });
}); 