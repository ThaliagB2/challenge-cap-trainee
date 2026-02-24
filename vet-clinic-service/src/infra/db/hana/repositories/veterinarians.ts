import cds from '@sap/cds';

import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { veterinariansRepository } from '@/domain/repositories/veterinarians';

export class VeterinariansRepositoryImpl implements veterinariansRepository {
    async findVeterinarianById(id: string): Promise<VeterinariansModel> {
        const vetQuerry = cds.ql.SELECT.from('veterinarians').where({ id });
        const vet = await cds.run(vetQuerry);
        if (!vet.length) {
            throw new Error(`Veterinarian with id ${id} not found`);
        }
        return VeterinariansModel.create({
            id: vet[0].id,
            firstName: vet[0].firstName,
            lastName: vet[0].lastName,
            specialty: vet[0].specialty,
            crmv: vet[0].crmv
        });
    }
}
