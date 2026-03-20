import cds from '@sap/cds';

import { OwnersModel } from '@/domain/models/db/owners';
import { ownersRepository } from '@/domain/repositories';

export class OwnersRepositoryImpl implements ownersRepository {
    public async findOwnersById(id: string): Promise<OwnersModel> {
        const ownerQuerry = cds.ql.SELECT.from('db.models.Owners').where({ id });
        const owner = await cds.run(ownerQuerry);
        return OwnersModel.create({
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            phone: owner.phone,
            email: owner.email
        });
    }
    //Buscar todos os agendamentos com status COMPLETED de todos os pets do tutor
    public async getCompletedAppointments(ownerId: string): Promise<any[]> {
        const completedAppointments = await cds.ql.SELECT.from('appointments').where({ status: 'COMPLETED', ownerId });
        return completedAppointments;
    }
}
