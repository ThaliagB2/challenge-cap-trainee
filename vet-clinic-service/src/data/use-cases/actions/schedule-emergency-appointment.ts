import { left, right } from '@sweet-monads/either';
import { randomUUID } from 'crypto';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentsModel } from '@/domain/models/db/appointments';
import { AppointmentsRepository, PetsRepository, VeterinariansRepository } from '@/domain/repositories';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { Translator } from '@/domain/utils/translator';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly petRepository: PetsRepository,
        private readonly vetRepository: VeterinariansRepository,
        private readonly appointmentRepository: AppointmentsRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: ScheduleEmergencyAppointmentUseCase.Params): Promise<ScheduleEmergencyAppointmentUseCase.Result> {
        try {
            const pet = await this.petRepository.findPetsById(params.pet_id);
            if (!pet) {
                return left(new NotFoundError(this.translator.translate('petNotFound')));
            }

            const vet = await this.vetRepository.findVeterinarianById(params.veterinarian_id);
            if (!vet) {
                return left(new NotFoundError(this.translator.translate('veterinarianNotFound')));
            }

            if (params.procedures.length === 0) {
                return left(new BadRequestError(this.translator.translate('emptyProceduresList')));
            }

            const appointment = AppointmentsModel.createEmergency({
                ...params,
                date: new Date(),
                procedures: params.procedures.map((p) => ({ ...p, id: randomUUID() }))
            });

            await this.appointmentRepository.create([appointment]);

            return right({ appointment: appointment.id, hasError: false });
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }
}
