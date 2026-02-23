import { BeforeCreateAppointmentController } from '@/presentation/entity-events/appointment';
import { makeBeforeCreateAppointmentUseCase } from '@/main/factories/use-cases/entity-events/appointment';

export const makeBeforeCreateAppointmentController = () => {
    const useCase = makeBeforeCreateAppointmentUseCase();
    return new BeforeCreateAppointmentController(useCase);
};

export const beforeCreateAppointmentController = makeBeforeCreateAppointmentController();
