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

    public async execute(ownerId: string): Promise<GetOwnerExpenseReportUseCase.Result> {
        const owner = await this.ownerRepository.findOwnersById(ownerId);

        if (!owner) {
            const menssage = this.translator.translate('owner_não_encontrado');
            return left(new NotFoundError(menssage));
        }

        const shedulings = await this.appointmentsRepository.findByOwnerIdAndStatus({ ownerId, status: 'COMPLETED' });

        if (shedulings.length === 0) {
            const message = this.translator.translate('owner_não_possui_agendamentos');
            return left(new NotFoundError(message));
        }

        const totalExpenses = shedulings.reduce((total, appointment) => total + appointment.totalCost, 0);
        const appointmentCount = shedulings.length;
        const averageCost = totalExpenses / appointmentCount;

        // Retornar right com os dados do relatório (ownerId, ownerName, totalExpenses, appointmentCount, averageCost)
        const reportData = OwnerExpenseReport.create({
            ownerId,
            ownerNameFull: owner.fullName,
            totalExpenses,
            appointmentCount,
            averageCost
        });

        return right(reportData);
    }
}
