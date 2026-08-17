import { scheduleEmergencyAppointmentUseCase } from '@/main/factories/use-cases/actions';
import { translator } from '@/main/factories/utils/translator';
import { ScheduleEmergencyAppointmentController } from '@/presentation/actions';

const makeScheduleEmergencyAppointmentController = (): ScheduleEmergencyAppointmentController => {
    return new ScheduleEmergencyAppointmentController(scheduleEmergencyAppointmentUseCase, translator);
};

export const scheduleEmergencyAppointmentController = makeScheduleEmergencyAppointmentController();
