import { left, right } from '@sweet-monads/either';

import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';
import { OwnerModel } from '@/domain/models/db/owner';
import { Translator } from '@/domain/utils/translator';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { AppointmentRepository, OwnerRepository } from '@/domain/repositories';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {}

    // eslint-disable-next-line max-lines-per-function
    public async execute(ownerId: string): Promise<GetOwnerExpenseReportUseCase.Result> {
        if (!ownerId) {
            const message = this.translator.translate('ownerIsRequired');
            return left(new BadRequestError(message));
        }

        const ownerExist = await this.validateOwnerExists(ownerId);
        if (!ownerExist) {
            const message = this.translator.translate('ownerNotFound');
            return left(new NotFoundError(message));
        }

        const schedulings = await this.appointmentRepository.generateReportByOwnerId(ownerId);

        if (schedulings.length === 0) {
            const message = this.translator.translate('noCompletedAppointmentsFoundForThisOwner');
            return left(new NotFoundError(message));
        }

        const totalExpenses = schedulings.reduce((total, appointment) => total + appointment.toObject().totalCost, 0);
        const appointmentCount = schedulings.length;
        const averageCost = totalExpenses / appointmentCount;

        const report = OwnerExpenseReportModel.create({
            ownerId,
            ownerFullName: `${ownerExist.firstName} ${ownerExist.lastName}`,
            totalExpenses,
            appointmentCount,
            averageCost
        });

        return right(report);
    }

    private async validateOwnerExists(ownerId: string): Promise<OwnerModel> {
        const owner = await this.ownerRepository.findById(ownerId);
        return owner;
    }
}
