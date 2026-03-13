import { NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentProps, OwnerExpenseReport } from '@/domain/models/db/appointment';
import { OwnerModel } from '@/domain/models/db/owner';
import { AppointmentRepository, OwnerRepository } from '@/domain/repositories';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { Translator } from '@/domain/utils/translator';
import { AppointmentStatus } from '@models/db/models';
import { left, right } from '@sweet-monads/either';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: GetOwnerExpenseReportUseCase.Params): Promise<GetOwnerExpenseReportUseCase.Result> {
        try {
            // Validação Owner
            const [owner] = await this.getOwner(params);
            if (!owner) return left(new NotFoundError(this.translator.translate('noOwnerFound')));

            // const completedAppointments = (await this.appointmentRepository.findAll()).filter((appointment) => appointment.status === AppointmentStatus.COMPLETED);
            // const ownersPetsCompletedAppointments = Array.from({ length: owner.pets.length }, (_, i) => {
            //     const pet = owner.pets[i];
            //     return completedAppointments.filter((appointment) => appointment.pet.id === pet.id);
            // });

            const ownersPetsAppointments = await Promise.all(owner.pets.map((pet) => this.appointmentRepository.findByPetId(pet.id)));
            if (!ownersPetsAppointments.length) return left(new NotFoundError(this.translator.translate('noOwnersPetAppointmentsFound')));

            const completedOwnersPetsAppointments = ownersPetsAppointments.flat().filter((appointment) => appointment.status === AppointmentStatus.COMPLETED);
            if (!completedOwnersPetsAppointments.length) return left(new NotFoundError(this.translator.translate('noCompletedOwnersPetAppointmentsFound')));

            const fullCompletedOwnersPetsAppointments = completedOwnersPetsAppointments.map((app) => app.toCreationObject());

            return right(this.getOwnerExpenseReport(fullCompletedOwnersPetsAppointments, owner));
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getOwner(ownerId: string): Promise<OwnerModel[]> {
        return this.ownerRepository.findById([ownerId]);
    }

    private getOwnerExpenseReport(appointments: AppointmentProps[], owner: OwnerModel): OwnerExpenseReport {
        const totalExpense = appointments.reduce((sum, app) => sum + app.totalCost, 0);
        const appointmentCount = appointments.length;
        const averageCost = totalExpense / appointmentCount;
        return {
            ownerId: owner.id,
            ownerName: `${owner.firstName} ${owner.lastName}`,
            totalExpense: totalExpense,
            appointmentCount: appointmentCount,
            averageCost: averageCost
        };
    }
}
