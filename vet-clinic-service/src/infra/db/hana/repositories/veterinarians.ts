import cds from '@sap/cds';

import { VeterinariansModel } from '@/domain/models/db/veterinarians';
import { VeterinariansRepository, VeterinarianRepository } from '@/domain/repositories/veterinarians';

export class VeterinariansRepositoryImpl implements VeterinariansRepository {
    private readonly ENTITY = 'db.models.Veterinarians';
    //refatorado
    public async findVeterinarianById(id: VeterinarianRepository.FindVeterinarianByIdParams): Promise<VeterinarianRepository.FindVeterinarianByIdResult> {
        const vetQuerry = cds.ql.SELECT.from(this.ENTITY).where({ id });
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
