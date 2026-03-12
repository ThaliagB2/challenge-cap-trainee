import cds from '@sap/cds';

import { VeterinarianRepository } from '@/domain/repositories';
import { VeterinarianModel, VeterinarianProps } from '@/domain/models/db/veterinarian';

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    private readonly ENTITY = 'db_models_Veterinarians';

    public async findById(id: string): Promise<VeterinarianModel> {
        const veterinarianQuery = cds.ql.SELECT.one.from(this.ENTITY).where({ id });
        const veterinarian: VeterinarianProps = await cds.run(veterinarianQuery);
        if (!veterinarian) {
            return null;
        }
        return VeterinarianModel.create({ ...veterinarian });
    }
}
