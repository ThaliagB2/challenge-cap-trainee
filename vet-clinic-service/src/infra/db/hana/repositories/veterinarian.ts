import cds from '@sap/cds';

import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { VeterinarianRepository } from '@/domain/repositories';

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    private readonly ENTITY_NAME = 'db.models.Veterinarians';

    public async findById(id: VeterinarianRepository.FindByIdParams): Promise<VeterinarianRepository.FindByIdResult> {
        const veterinarianQuery = cds.ql.SELECT.one.from(this.ENTITY_NAME).where({ id });

        const veterinarian = await cds.run(veterinarianQuery);

        if (!veterinarian) {
            return null;
        }

        return VeterinarianModel.with({
            id: veterinarian.id as string,
            firstName: veterinarian.firstName as string,
            lastName: veterinarian.lastName as string,
            specialty: veterinarian.specialty as string,
            crmv: veterinarian.crmv as string
        });
    }
}
