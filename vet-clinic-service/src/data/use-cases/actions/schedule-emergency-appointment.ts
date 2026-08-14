import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions';
import { AppointmentRepositoryImpl, PetRepositoryImpl, ProcedureRepositoryImpl, VeterinarianRepositoryImpl } from '@/infra/db/hana/repositories';

export class ScheduleEmergencyAppointmentUseCaseImpl implements ScheduleEmergencyAppointmentUseCase {
    constructor(
        private readonly petRepository: PetRepositoryImpl,
        private readonly veterinarianRepository: VeterinarianRepositoryImpl,
        private readonly appointmentRepository: AppointmentRepositoryImpl,
        private readonly procedureRepository: ProcedureRepositoryImpl
    ) {}

    public async execute(
        params: ScheduleEmergencyAppointmentUseCase.ScheduleEmergencyAppointmentUseCaseParams
    ): Promise<ScheduleEmergencyAppointmentUseCase.ScheduleEmergencyAppointmentUseCaseResult> {
        try {
            const pet = await this.petRepository.findById(params.pet_id);
            if (!pet) {
                return left(new NotFoundError('Pet not found'));
            }

            const veterinarians = await this.veterinarianRepository.findById(params.veterinarian_id);
            if (!veterinarians) {
                return left(new NotFoundError('Veterinarians not found'));
            }

            if (!params.procedures || params.procedures.length == 0) {
                return left(new BadRequestError('At least one procedure is required'));
            }

            const model = AppointmentModel.forEmergencyCreate({
                ...params
            });

            await this.appointmentRepository.create(model);

            return right(model.toCreationEmergencyObject());
        } catch (error) {
            const err = error as Error;
            return left(new ServerError(err.message, err.stack));
        }
    }
}
