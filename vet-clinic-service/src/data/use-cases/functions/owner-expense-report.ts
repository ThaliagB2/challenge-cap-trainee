import { left, right } from '@sweet-monads/either';

import { NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { OwnerExpenseReportProps, OwnerModel } from '@/domain/models/db/owner';
import { PetModel } from '@/domain/models/db/pet';
import { OwnerRepository, PetRepository } from '@/domain/repositories';
import { AppointmentRepository } from '@/domain/repositories/appointments';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly petRepository: PetRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {}

    public async execute(owner_id: GetOwnerExpenseReportUseCase.GetOwnerExpenseReportUseCasParams): Promise<GetOwnerExpenseReportUseCase.GetOwnerExpenseReportUseCasResult> {
        try {
            const owner = await this.ownerRepository.findById(owner_id);
            if (!owner) {
                return left(new NotFoundError('owner.notFound'));
            }

            const pets = await this.petRepository.findByOwnerId(owner_id);
            if (!pets || pets.length == 0) {
                return left(new NotFoundError('owner.petsNotFound'));
            }

            const appointments = (await Promise.all(pets.map(async (pet: PetModel) => this.appointmentRepository.findByPetId(pet.id)))).flat();
            if (!appointments || appointments.length == 0) {
                return left(new NotFoundError(''));
            }

            const completed = appointments.filter((appointment) => appointment.status_id === 'COMPLETED');
            if (completed.length == 0) {
                return left(new NotFoundError('owner.noCompletedProcedures='));
            }

            const OwnerExpenseReport = await this.getOwnerExpenseReport(owner, completed);

            return right(OwnerExpenseReport);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack));
        }
    }

    private async getOwnerExpenseReport(owner: OwnerModel, completed: AppointmentModel[]): Promise<OwnerExpenseReportProps> {
        const name = owner.firstName + ' ' + owner.lastName;
        const totalcost = completed.reduce((sum: number, appointment: AppointmentModel) => sum + appointment.totalCost, 0);
        const appointmentCount = completed.length;
        const averageCost = totalcost / appointmentCount;
        const ownerExpenseReport: OwnerExpenseReportProps = {
            ownerName: name,
            totalCost: totalcost,
            appointmentCount: appointmentCount,
            averageCost: averageCost
        };
        return ownerExpenseReport;
    }
}
