/* eslint-disable max-lines-per-function */
import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { OwnerModel } from '@/domain/models/db/owner';
import { PetModel } from '@/domain/models/db/pet';
import { ProcedureModel } from '@/domain/models/db/procedure';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { OwnerRepository, PetRepository, ProcedureRepository, VeterinarianRepository } from '@/domain/repositories';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly translator: Translator,
        private readonly ownerRepository: OwnerRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly petRepository: PetRepository,
        private readonly procedureRepository: ProcedureRepository
    ) {}

    public async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const appointment = AppointmentModel.create(params);

            const validatedAppointment = appointment.validate();
            if (validatedAppointment.hasError) {
                const errorMessages = validatedAppointment.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n');
                return left(new BadRequestError(errorMessages));
            }

            // Validação Owner
            const checkOwnerValidity = await this.validateOwner(appointment);
            if (checkOwnerValidity.hasError) {
                const errorMessages = checkOwnerValidity.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n');
                return left(new NotFoundError(errorMessages));
            }

            // Validação Pet
            const checkPetValidity = await this.validatePet(appointment);
            if (checkPetValidity.hasError) {
                const errorMessages = checkPetValidity.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n');
                return left(new NotFoundError(errorMessages));
            }

            // Validação Veterinarian
            const checkVetValidity = await this.validateVeterinarian(appointment);
            if (checkVetValidity.hasError) {
                const errorMessages = checkVetValidity.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n');
                return left(new NotFoundError(errorMessages));
            }

            // Validação das Procedures
            const appProcedures = appointment.procedures.map((proc) => proc.id);
            const procedures = await this.getProcedures(appProcedures);
            if (!procedures) {
                const message = this.translator.translate('noProceduresFound');
                return left(new BadRequestError(message));
            }
            const validatedProcedures = this.validateProcedures(appProcedures, procedures);
            if (validatedProcedures.hasError) return left(new BadRequestError(validatedProcedures.errorMessages.join('\n')));

            // O retorno já calcula o custo total e injeta o status ao formatar o objeto Appointment
            return right(appointment.toCreationObjectForEmergencyAppointment());
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getOwner(ownerId: string): Promise<OwnerModel[]> {
        return this.ownerRepository.findById([ownerId]);
    }

    private async getVeterinarian(vetId: string): Promise<VeterinarianModel[]> {
        return this.veterinarianRepository.findById([vetId]);
    }

    private async getPet(petId: string): Promise<PetModel[]> {
        return this.petRepository.findById([petId]);
    }

    private async getOwnerPetId(owner: OwnerModel[]): Promise<PetModel[]> {
        const ownerId = owner.map((o) => o.id);
        return this.petRepository.findByOwnerId(ownerId);
    }

    private validatePetOwnerMatch([pet]: PetModel[], [ownerPet]: PetModel[]): ValidationResult {
        if (pet.id.trim() !== ownerPet.id) {
            const message = this.translator.translate({ text: 'petDoesNotMatchOwner', args: pet.id });
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }

    private async getProcedures(procedureIds: string[]): Promise<ProcedureModel[]> {
        return this.procedureRepository.findByIds(procedureIds);
    }

    private validateProcedures(appProcedures: string[], procedures: ProcedureModel[]): ValidationResult {
        const proceduresIds = procedures.map((proc) => proc.id);

        const proceduresNotFound = appProcedures.filter((procId) => !proceduresIds.includes(procId));
        if (proceduresNotFound.length > 0) {
            const proceduresNotFoundIds = proceduresNotFound.join(', ');
            const message = this.translator.translate({ text: 'specificProceduresNotFound', args: proceduresNotFoundIds });
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }

    private async validateOwner(appointment: AppointmentModel): Promise<ValidationResult> {
        const appOwnerId = appointment.owner.id;
        const owner = await this.getOwner(appOwnerId);
        if (!owner) {
            const message = this.translator.translate('noOwnerFound');
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }

    private async validatePet(appointment: AppointmentModel): Promise<ValidationResult> {
        const appPetId = appointment.pet.id;
        const pet = await this.getPet(appPetId);
        if (!pet) {
            const message = this.translator.translate('noPetFound');
            return { hasError: true, errorMessages: [message] };
        }

        const ownerPetId = await this.getOwnerPetId(await this.getOwner(appointment.owner.id));
        const validatedPet = this.validatePetOwnerMatch(pet, ownerPetId);
        if (validatedPet.hasError) return { hasError: true, errorMessages: validatedPet.errorMessages };

        return { hasError: false };
    }

    private async validateVeterinarian(appointment: AppointmentModel): Promise<ValidationResult> {
        const appVetId = appointment.veterinarian.id;
        const vet = await this.getVeterinarian(appVetId);
        if (!vet) {
            const message = this.translator.translate('noVeterinarianFound');
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }
}
