import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { OwnerModel } from '@/domain/models/db/owner';
import { PetProps } from '@/domain/models/db/pet';
import { Translator } from '@/domain/utils/translator';
import { AppointmentRepository, OwnerRepository } from '@/domain/repositories';
import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';

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
            const ownerId = params.owner_id;
            if (!ownerId) {
                return left(new BadRequestError('ownerIdIsRequired'));
            }

            const ownerExpenseReport = AppointmentModel.createOwnerExpenseReportDraft({ ownerId: ownerId });

            const owner = await this.getOwner(ownerId);
            if (!owner) {
                return left(new NotFoundError(this.translator.translate('ownerNotFound')));
            }

            const ownerPetsAppointments = await this.getOwnerPetsAppointments(owner.pets);
            if (!ownerPetsAppointments) {
                return left(new NotFoundError(this.translator.translate('ownersPetsAppointmentsNotFound')));
            }

            return right(ownerExpenseReport.createOwnerExpenseReport(ownerPetsAppointments, owner));
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getOwner(ownerId: string): Promise<OwnerModel> {
        const owner = await this.ownerRepository.findById({ id: ownerId });
        return owner;
    }

    private async getOwnerPetsAppointments(pets: PetProps[]): Promise<AppointmentModel[]> {
        const appointments = await Promise.all(pets.map((pet) => this.appointmentRepository.findByPetId({ petId: pet.id })));
        return appointments.flat().filter((app) => app.status === 'COMPLETED');
    }
}
