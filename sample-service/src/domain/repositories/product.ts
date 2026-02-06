import { ProductModel } from '@/domain/models/db/product';

export interface ProductRepository {
    findAll(): Promise<ProductModel[]>;
    findByIds(ids: string[]): Promise<ProductModel[]>;
}
