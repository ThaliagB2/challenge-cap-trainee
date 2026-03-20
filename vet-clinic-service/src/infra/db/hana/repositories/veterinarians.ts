import cds from '@sap/cds';

import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { veterinariansRepository } from '@/domain/repositories/veterinarians';

export class VeterinariansRepositoryImpl implements veterinariansRepository {
    public async findVeterinarianById(id: string): Promise<VeterinariansModel> {
        const vetQuerry = cds.ql.SELECT.from('db.models.Veterinarians').where({ id });
        const vet = await cds.run(vetQuerry);
        return VeterinariansModel.create({
            id: vet.id,
            firstName: vet.firstName,
            lastName: vet.lastName,
            specialty: vet.specialty,
            crmv: vet.crmv
        });
    }
}
