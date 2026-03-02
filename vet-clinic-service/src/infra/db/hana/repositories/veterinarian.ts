import cds from '@sap/cds';

import { Veterinarian } from '@models/db/models';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { VeterinarianRepository } from '@/domain/repositories';

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    private readonly ENTITY = 'db_models_Veterinarians';

    public async findById(id: string): Promise<VeterinarianModel> {
        const veterinarianQuery = SELECT.from(this.ENTITY).where({ id });
        const [veterinarian]: Veterinarian[] = await cds.run(veterinarianQuery);
        if (!veterinarian) {
            return null;
        }
        return VeterinarianModel.create({
            id: veterinarian.id,
            firstName: veterinarian.firstName,
            lastName: veterinarian.lastName,
            specialty: veterinarian.specialty,
            crmv: veterinarian.crmv
        });
    }
}
