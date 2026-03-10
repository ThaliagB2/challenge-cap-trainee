import cds from '@sap/cds';

import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { VeterinarianRepository } from '@/domain/repositories';
import { Veterinarians } from '@models/db/models';

export class VeterinarianRepositoryImpl implements VeterinarianRepository {
    private readonly VETERINARIAN = 'db.models.Veterinarian';

    public async findAll(): Promise<VeterinarianModel[]> {
        const veterinariansQuery = cds.ql.SELECT.from(this.VETERINARIAN);
        const veterinarians: Veterinarians = await cds.run(veterinariansQuery);

        if (veterinarians.length === 0) return null;

        return veterinarians.map((vet) =>
            VeterinarianModel.with({
                id: vet.id as string,
                firstName: vet.firstName as string,
                lastName: vet.lastName as string,
                specialty: vet.specialty as string,
                state: vet.state as string,
                crmv: vet.crmv as number
            })
        );
    }

    public async findById(ids: string[]): Promise<VeterinarianModel[]> {
        const veterinariansQuery = cds.ql.SELECT.from(this.VETERINARIAN).where({ id: { in: ids } });
        const veterinarians: Veterinarians = await cds.run(veterinariansQuery);

        if (veterinarians.length === 0) return null;

        return veterinarians.map((vet) =>
            VeterinarianModel.with({
                id: vet.id as string,
                firstName: vet.firstName as string,
                lastName: vet.lastName as string,
                specialty: vet.specialty as string,
                state: vet.state as string,
                crmv: vet.crmv as number
            })
        );
    }
}
