import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';
import { OwnerModel } from '@/domain/models/db/owner';
import { PetProps } from '@/domain/models/db/pet';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';
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

            const ownerExpenseReportModel = OwnerExpenseReportModel.create({ ownerId: ownerId });

            const owner = await this.getOwner(ownerId);
            if (this.isValidationResult(owner)) {
                const message = this.translator.translate('ownerNotFound');
                return left(new NotFoundError(message));
            }

            const ownerPetsAppointments = await this.getOwnerPetsAppointments(owner.pets);
            if (this.isValidationResult(ownerPetsAppointments)) {
                const message = this.translator.translate('ownersPetsAppointmentsNotFound');
                return left(new NotFoundError(message));
            }

            const ownerExpenseReport = ownerExpenseReportModel.generateOwnerExpenseReport(ownerPetsAppointments, owner);
            return right(ownerExpenseReport.toFullObject());
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private isValidationResult(value: ValidationResult | OwnerModel | AppointmentModel[]): value is ValidationResult {
        return 'hasError' in value;
    }

    private async getOwner(ownerId: string): Promise<OwnerModel | ValidationResult> {
        const errors = [];
        const owner = await this.ownerRepository.findById({ id: ownerId });
        if (!owner) {
            errors.push(this.translator.translate('ownerNotFound'));
            return { hasError: errors.length > 0, errorMessages: errors };
        }
        return owner;
    }

    private async getOwnerPetsAppointments(pets: PetProps[]): Promise<AppointmentModel[] | ValidationResult> {
        const appointments = await Promise.all(pets.map((pet) => this.appointmentRepository.findByPetId({ petId: pet.id })));
        return appointments.flat().filter((app) => app.status === 'COMPLETED');
    }
}
