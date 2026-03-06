import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentsModel } from '@/domain/models/db/appointments';
import { appointmentsRepository, petsRepository, proceduresRepository, veterinariansRepository } from '@/domain/repositories';
import { ResultPayload, scheduleEmergencyAppointmentUsecase, ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { left, right } from '@sweet-monads/either';

export class scheduleEmergencyAppointmentImpl implements scheduleEmergencyAppointmentUsecase {
    constructor(
        private readonly petRepository: petsRepository,
        private readonly vetRepository: veterinariansRepository,
        private readonly proceduriesRepository: proceduresRepository,
        private readonly appointmentRepository: appointmentsRepository
    ) {}

    public async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const PetExist = await this.ValidatePet(params.pet_id);
            if (PetExist.hasError) {
                return left(new NotFoundError('Pet não encontrado'));
            }

            const VetExist = await this.ValidateVet(params.veterinarian_id);
            if (VetExist.hasError) {
                return left(new NotFoundError('Veterinario não encontrado'));
            }

            if (params.procedures.length === 0) {
                return left(new BadRequestError('Lista de Procedimentos esta vazia'));
            }

            const appointment = AppointmentsModel.createEmergency(params);
            await this.appointmentRepository.create([appointment]);
            return right({
                appointment: appointment.id,
                hasError: false
            });
        } catch {
            return left(new ServerError('Erro ao agendar consulta de emergência'));
        }
    }

    private async ValidatePet(petId: string): Promise<ResultPayload> {
        const pet = await this.petRepository.findPetsById(petId);
        if (!pet) {
            return {
                hasError: true,
                errorMessage: 'Pet não encontrado'
            };
        }
        return {
            pet,
            hasError: false
        };
    }

    private async ValidateVet(veterinarianId: string): Promise<ResultPayload> {
        const vet = await this.vetRepository.findVeterinarianById(veterinarianId);
        if (!vet) {
            return {
                hasError: true,
                errorMessage: 'Veterinario não encontrado'
            };
        }
        return {
            vet,
            hasError: false
        };
    }
}
