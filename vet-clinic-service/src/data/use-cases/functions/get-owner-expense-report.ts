/* eslint-disable max-lines-per-function */
import { NotFoundError } from '@/domain/errors';
import { OwnerExpenseReport } from '@/domain/models/db/get-owner-expense-report';
import { AppointmentsRepository, OwnersRepository } from '@/domain/repositories';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { Translator } from '@/domain/utils/translator';
import { left, right } from '@sweet-monads/either';

export class GetOwnerExpenseReportImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnersRepository,
        private readonly appointmentsRepository: AppointmentsRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result> {
        const owner = await this.ownerRepository.findOwnersById({ id: params.ownerId });

        if (!owner) {
            const menssage = this.translator.translate('owner_não_encontrado');
            return left(new NotFoundError(menssage));
        }

        const petIds = await this.appointmentsRepository.findPetsByOwnerId(params.ownerId);

        if (petIds.length === 0) {
            const message = this.translator.translate('owner_não_possui_agendamentos');
            return left(new NotFoundError(message));
        }

        const shedulings = await this.appointmentsRepository.findByPetIdsAndStatus(petIds, 'COMPLETED');

        if (shedulings.length === 0) {
            const message = this.translator.translate('owner_não_possui_agendamentos');
            return left(new NotFoundError(message));
        }

        const totalExpenses = OwnerExpenseReport.totalExpenses(shedulings);

        const appointmentCount = shedulings.length;

        const averageCost = OwnerExpenseReport.averageCost(totalExpenses, appointmentCount);

        // Retornar right com os dados do relatório (ownerId, ownerName, totalExpenses, appointmentCount, averageCost)
        const reportData = OwnerExpenseReport.create({
            ownerId: params.ownerId,
            ownerNameFull: owner.fullName,
            totalExpenses,
            appointmentCount,
            averageCost
        });

        return right(reportData);
    }
}
