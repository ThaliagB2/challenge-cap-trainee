import { BeforeCreateAppointmentsController } from '@/presentation/entity-events/appointments';
import { makeBeforeCreateAppointmentUseCase } from '@/main/factories/use-cases/entity-events/appointments';

export const makeBeforeCreateAppointmentController = () => {
    const useCase = makeBeforeCreateAppointmentUseCase();
    return new BeforeCreateAppointmentsController(useCase);
};

export const beforeCreateAppointmentController = makeBeforeCreateAppointmentController();
