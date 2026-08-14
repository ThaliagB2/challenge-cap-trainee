import { makeBeforeCreateAppointmentUseCase } from '@/main/factories/use-cases/entity-events/appointments/before-create';
import { BeforeCreateAppointmentController } from '@/presentation/entity-events/appointments/before-create';

export const makeBeforeCreateAppointmentController = () => {
    const useCase = makeBeforeCreateAppointmentUseCase();

    return new BeforeCreateAppointmentController(useCase);
};

export const beforeCreateAppointmentController = makeBeforeCreateAppointmentController();
