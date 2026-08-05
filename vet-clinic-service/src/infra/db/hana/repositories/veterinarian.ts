import cds from "@sap/cds";

import { VeterinarianModel } from "@/domain/models/db/veterinarian";
import { VeterinarianRepository } from "@/domain/repositories/veterinarian";
import { Veterinarian } from "@models/db/models";

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    private readonly ENTITY_NAME = 'db.models.Veterinarian'

    public async findById(id: string): Promise<VeterinarianModel | null> {
        const veterinarian = await cds.ql.SELECT.one.from(this.ENTITY_NAME).where({ id });
        if(!veterinarian){
            return null;
        }
        return this.toModel(veterinarian);
    }

    private toModel(veterianarian: Veterinarian): VeterinarianModel {
        return VeterinarianModel.with({
            id: veterianarian.id as string,
            firstName: veterianarian.firstName as string,
            lastName: veterianarian.lastName as string,
            specialty: veterianarian.specialty as string,
            crmv: veterianarian.crmv as string
        })
    }
}