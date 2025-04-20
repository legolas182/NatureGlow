import { Category } from '../../models/Category';

export interface ICategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: number): Promise<Category | null>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: number, categoryData: Partial<Category>): Promise<Category | null>;
    delete(id: number): Promise<boolean>;
    findWithProducts(): Promise<Category[]>;
    toggleStatus(id: number): Promise<Category | null>;
} 