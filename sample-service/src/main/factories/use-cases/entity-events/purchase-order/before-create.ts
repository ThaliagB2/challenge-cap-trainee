import { BeforeCreatePurchaseOrderUseCaseImpl } from '@/data/use-cases/entity-events/purchase-order/before-create';
import { ProductRepositoryImpl } from '@/infra/db/hana/repositories/product';
import { translator } from '@/main/factories/utils/translator';

export const makeBeforeCreatePurchaseOrderUseCase = () => {
    const repository = new ProductRepositoryImpl();
    return new BeforeCreatePurchaseOrderUseCaseImpl(repository, translator);
};
