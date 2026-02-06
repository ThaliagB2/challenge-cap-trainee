import cds from '@sap/cds';

import { ProductModel } from '@/domain/models/db/product';
import { ProductRepository } from '@/domain/repositories';
import { Products } from '@models/db/models';

export class ProductRepositoryImpl implements ProductRepository {
    private readonly ENTITY_NAME = 'db.models.Products';

    public async findAll(): Promise<ProductModel[] | null> {
        const productsQuery = cds.ql.SELECT.from(this.ENTITY_NAME);
        const products: Products = await cds.run(productsQuery);
        if (products.length === 0) {
            return null;
        }
        return products.map((product) =>
            ProductModel.basic({
                id: product.id as string,
                name: product.name as string,
                price: product.price as number
            })
        );
    }

    public async findByIds(ids: string[]): Promise<ProductModel[] | null> {
        const productsQuery = cds.ql.SELECT.from(this.ENTITY_NAME).where({ id: { in: ids } });
        const products: Products = await cds.run(productsQuery);
        if (products.length === 0) {
            return null;
        }
        return products.map((product) => ProductModel.basic({ id: product.id as string, name: product.name as string, price: product.price as number }));
    }
}
