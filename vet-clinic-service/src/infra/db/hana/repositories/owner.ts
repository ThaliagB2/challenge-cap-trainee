import { OwnerModel } from "@/domain/models/db/owner";
import { OwnerRepository } from "@/domain/repositories";
import { Owner } from "@models/db/models";
import cds from "@sap/cds";

export class OwnerRepositoryImpl implements OwnerRepository {
    private readonly ENTITY_NAME = 'db.models.Owners';

    public async findById(id: string): Promise<OwnerModel | null> {
        const owner = await cds.ql.SELECT.one.from(this.ENTITY_NAME).where({ id });
        if(!owner){
            return null;
        }
        return this.toModel(owner)
    }

    private toModel (owner: Owner): OwnerModel {
        return OwnerModel.with({ 
            id: owner.id as string, 
            firstName: owner.firstName as string, 
            lastName: owner.lastName as string, 
            phone: owner.phone as string,
            email: owner.email as string
        })
    }
}