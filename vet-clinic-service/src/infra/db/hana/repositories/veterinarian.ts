import cds from '@sap/cds';

import { VeterinarianRepository } from '@/domain/repositories';
import { VeterinarianModel, VeterinarianProps } from '@/domain/models/db/veterinarian';

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    private readonly ENTITY = 'db.models.Veterinarians';

    public async findById(params: VeterinarianRepository.FindByIdParams): Promise<VeterinarianRepository.FindByIdResult> {
        const query = cds.ql.SELECT.one.from(this.ENTITY).where({ id: params.id });
        const result: VeterinarianProps = await cds.run(query);

        if (!result) {
            return null;
        }

        return VeterinarianModel.with(result);
    }
}
