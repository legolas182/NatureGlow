import { Product } from '../../models/Product';

export interface IProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: number, productData: Partial<Product>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
    updateStock(id: number, quantity: number): Promise<Product | null>;
    toggleStatus(id: number): Promise<Product | null>;
} 