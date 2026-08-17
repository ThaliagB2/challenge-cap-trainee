import { beforeCreateAppointmentUseCase } from '@/main/factories/use-cases/entity-events/appointments/before-create';
import { translator } from '@/main/factories/utils/translator';
import { BeforeCreateAppointmentController } from '@/presentation/entity-events/appointments';

const makeBeforeCreateAppointmentController = (): BeforeCreateAppointmentController => {
    return new BeforeCreateAppointmentController(beforeCreateAppointmentUseCase, translator);
};

export const beforeCreateAppointmentController = makeBeforeCreateAppointmentController();
