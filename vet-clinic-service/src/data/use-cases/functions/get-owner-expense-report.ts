import { left, right } from '@sweet-monads/either';

import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { NotFoundError } from '@/domain/errors';
import { OwnerModel } from '@/domain/models/db/owner';
import { AppointmentRepository, OwnerRepository } from '@/domain/repositories';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {
        this.ownerRepository = ownerRepository;
        this.appointmentRepository = appointmentRepository;
    }

    async execute(ownerId: string): Promise<GetOwnerExpenseReportUseCase.Result> {
        const ownerExist = await this.validateOwnerExists(ownerId);
        if (!ownerExist) {
            return left(new NotFoundError('Owner not found'));
        }

        const schedulings = await this.appointmentRepository.generateReportByOwnerId(ownerId);

        if (schedulings) {
            const totalExpenses = schedulings.reduce((total, appointment) => total + appointment.totalCost, 0);
            const appointmentCount = schedulings.length;
            const averageCost = totalExpenses / appointmentCount;

            return right([ownerId, `${ownerExist.firstName} ${ownerExist.lastName}`, totalExpenses, appointmentCount, averageCost]);
        } else {
            return left(new NotFoundError('No appointments found'));
        }
    }

    private async validateOwnerExists(ownerId: string): Promise<OwnerModel> {
        const owner = await this.ownerRepository.findById(ownerId);
        return owner;
    }
}
