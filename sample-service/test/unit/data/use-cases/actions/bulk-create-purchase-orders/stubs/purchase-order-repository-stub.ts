import { PurchaseOrderModel } from '@/domain/models/db/purchase-order';
import { PurchaseOrderRepository } from '@/domain/repositories';

export class PurchaseOrderRepositoryStub implements PurchaseOrderRepository {
    private storage: PurchaseOrderModel[] = [];
    private shouldThrowError = false;
    private errorToThrow?: Error;

    constructor() {}

    public setError(error: Error): void {
        this.shouldThrowError = true;
        this.errorToThrow = error;
    }

    public clearError(): void {
        this.shouldThrowError = false;
        this.errorToThrow = undefined;
    }

    public async bulkCreate(purchaseOrders: PurchaseOrderModel[]): Promise<void> {
        if (this.shouldThrowError && this.errorToThrow) {
            throw this.errorToThrow;
        }

        this.storage.push(...purchaseOrders);
        return Promise.resolve();
    }

    public getStorage(): PurchaseOrderModel[] {
        return [...this.storage];
    }

    public clearStorage(): void {
        this.storage = [];
    }

    public async create(purchaseOrder: PurchaseOrderModel): Promise<PurchaseOrderModel> {
        if (this.shouldThrowError && this.errorToThrow) {
            throw this.errorToThrow;
        }

        this.storage.push(purchaseOrder);
        return Promise.resolve(purchaseOrder);
    }
}
