import { ProductModel } from '@/domain/models/db/product';
import { ProductRepository } from '@/domain/repositories';

export class ProductRepositoryStub implements ProductRepository {
    private storage: ProductModel[] = [];
    private shouldThrowError = false;
    private errorToThrow?: Error;

    constructor(products: Array<{ id: string; name: string; price: number }> = []) {
        this.storage = products.map((product) => ProductModel.basic(product));
    }

    public setError(error: Error): void {
        this.shouldThrowError = true;
        this.errorToThrow = error;
    }

    public clearError(): void {
        this.shouldThrowError = false;
        this.errorToThrow = undefined;
    }

    public async findByIds(ids: string[]): Promise<ProductModel[]> {
        if (this.shouldThrowError && this.errorToThrow) {
            throw this.errorToThrow;
        }

        const results = this.storage.filter((product) => ids.includes(product.id));
        return Promise.resolve(results);
    }

    public async findAll(): Promise<ProductModel[]> {
        if (this.shouldThrowError && this.errorToThrow) {
            throw this.errorToThrow;
        }
        return Promise.resolve(this.storage);
    }

    public async findById(id: string): Promise<ProductModel | null> {
        if (this.shouldThrowError && this.errorToThrow) {
            throw this.errorToThrow;
        }

        const result = this.storage.find((product) => product.id === id);
        return Promise.resolve(result || null);
    }
}
