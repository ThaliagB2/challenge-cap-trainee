import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { OwnerModel } from '@/domain/models/db/owner';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';
import { AppointmentRepository, OwnerRepository } from '@/domain/repositories';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { Translator } from '@/domain/utils/translator';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly translator: Translator,
        private readonly ownerRepository: OwnerRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {
        this.translator = translator;
        this.ownerRepository = ownerRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public async execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result> {
        try {
            if (!params.owner_id) {
                return left(new BadRequestError('ownerIdIsRequired'));
            }

            const owner = await this.ownerRepository.findById({ id: params.owner_id });
            if (!owner) {
                const message = this.translator.translate('ownerNotFound');
                return left(new NotFoundError(message));
            }

            const ownerPetsAppointments = await this.appointmentRepository.findByOwnerId({ ownerId: params.owner_id });
            if (ownerPetsAppointments.length === 0) {
                const message = this.translator.translate('ownersPetsAppointmentsNotFound');
                return left(new NotFoundError(message));
            }
            const ownerExpenseReport = this.generateOwnerExpenseReport(ownerPetsAppointments, owner);
            return right(ownerExpenseReport.toFullObject());
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private generateOwnerExpenseReport(appointments: AppointmentModel[], owner: OwnerModel): OwnerExpenseReportModel {
        const ownersId = owner.id;
        const ownersName = `${owner.firstName} ` + `${owner.lastName}`;
        const totalExpense = appointments.reduce((sum, app) => sum + app.totalCost, 0);
        const appointmentCount = appointments.length;
        const averageCost = totalExpense / appointmentCount;
        return OwnerExpenseReportModel.with({
            ownerId: ownersId,
            ownerName: ownersName,
            totalExpense: totalExpense,
            appointmentCount: appointmentCount,
            averageCost: averageCost
        });
    }
}
