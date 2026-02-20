import cds from '@sap/cds';

import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { VeterinarianRepository } from '@/domain/repositories';

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    async findById(id: string): Promise<VeterinarianModel> {
        const veterinarianQuery = SELECT.from('Veterinarians').where({ id });
        const veterinarian = await cds.run(veterinarianQuery);
        if (veterinarian.length === 0) {
            return null;
        }
        return VeterinarianModel.create({
            id: veterinarian[0].id,
            firstName: veterinarian[0].firstName,
            lastName: veterinarian[0].lastName,
            specialty: veterinarian[0].specialty,
            crmv: veterinarian[0].crmv
        });
    }
}
