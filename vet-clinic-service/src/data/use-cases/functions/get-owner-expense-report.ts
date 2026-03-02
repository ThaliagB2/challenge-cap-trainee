import { left, right } from '@sweet-monads/either';

import { GetOwnerExpenseReportUseCase, PayloadResult } from '@/domain/use-cases/functions/get-owner-expense-report';
import { NotFoundError } from '@/domain/errors';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';
import { AppointmentRepository, OwnerRepository } from '@/domain/repositories';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {}

    async execute(ownerId: string): Promise<GetOwnerExpenseReportUseCase.Result> {
        const ownerExist = await this.validateOwnerExists(ownerId);
        if (ownerExist.hasError) {
            return left(new NotFoundError(ownerExist.errorMessage));
        }

        const schedulings = await this.appointmentRepository.generateReportByOwnerId(ownerId);

        if (schedulings.length === 0) {
            return left(new NotFoundError('No completed appointments found for this owner'));
        }

        const totalExpenses = schedulings.reduce((total, appointment) => total + appointment.toObject().totalCost, 0);
        const appointmentCount = schedulings.length;
        const averageCost = totalExpenses / appointmentCount;

        const report = OwnerExpenseReportModel.create({
            ownerId,
            ownerFullName: `${ownerExist.owner.firstName} ${ownerExist.owner.lastName}`,
            totalExpenses,
            appointmentCount,
            averageCost
        });

        return right({
            hasError: false,
            report
        });
    }

    private async validateOwnerExists(ownerId: string): Promise<PayloadResult> {
        const owner = await this.ownerRepository.findById(ownerId);

        if (!owner) {
            return {
                hasError: true,
                errorMessage: 'Owner not found'
            };
        }

        return {
            owner,
            hasError: false
        };
    }
}
