import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentsModel } from '@/domain/models/db/appointments';
import { AppointmentsRepository, PetsRepository, ProceduresRepository, VeterinariansRepository } from '@/domain/repositories';
import { ResultPayload, ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { left, right } from '@sweet-monads/either';
import { randomUUID } from 'crypto';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly petRepository: PetsRepository,
        private readonly vetRepository: VeterinariansRepository,
        private readonly appointmentRepository: AppointmentsRepository
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

            params.procedures = params.procedures.map((p) => ({ ...p, id: randomUUID() }));
            params.date = new Date();

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
