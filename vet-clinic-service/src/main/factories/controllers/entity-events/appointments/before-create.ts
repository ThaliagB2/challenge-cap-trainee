import { makeBeforeCreateAppointmentUseCase } from '@/main/factories/use-cases/entity-events/appointments';
import { BeforeCreateAppointmentsController } from '@/presentation/entity-events/appointments';

const makeBeforeCreateAppointmentController = () => {
    const useCase = makeBeforeCreateAppointmentUseCase();
    return new BeforeCreateAppointmentsController(useCase);
};

export const beforeCreateAppointmentController = makeBeforeCreateAppointmentController();
