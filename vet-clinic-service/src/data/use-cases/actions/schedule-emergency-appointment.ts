import { left, right } from '@sweet-monads/either';

import { AppointmentModel } from '@/domain/models/db/appointment';
import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { PetModel } from '@/domain/models/db/pet';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { Translator } from '@/domain/utils/translator';
import { AppointmentRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {
        this.petRepository = petRepository;
        this.veterinarianRepository = veterinarianRepository;
        this.appointmentRepository = appointmentRepository;
        this.translator = translator;
    }

    async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const petExists = await this.validatePetExists(params.pet_id);
            if (!petExists) {
                return left(new NotFoundError('Pet not found'));
            }

            const veterinarianExists = await this.validateVeterinarianExists(params.veterinarian_id);
            if (!veterinarianExists) {
                return left(new NotFoundError('Veterinarian not found'));
            }

            if (params.procedures.length === 0) {
                return left(new BadRequestError('No procedures provided'));
            }

            const appointment = AppointmentModel.createEmergencyAppointment(params);
            await this.appointmentRepository.create([appointment]);
            return right(appointment.id);
        } catch {
            return left(new ServerError('Internal server error'));
        }
    }

    private async validatePetExists(petId: string): Promise<PetModel> {
        const pet = await this.petRepository.findById(petId);
        return pet;
    }

    private async validateVeterinarianExists(veterinarianId: string): Promise<VeterinarianModel> {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);
        return veterinarian;
    }
}
