import { makeScheduleEmergencyAppointmentUseCase } from '@/main/factories/use-cases/actions/schedule-emergency-appointment';
import { ScheduleEmergencyAppointmentController } from '@/presentation/actions/schedule-emergency-appointment';

export const makeScheduleEmergencyAppointmentController = () => {
    const useCase = makeScheduleEmergencyAppointmentUseCase();
    return new ScheduleEmergencyAppointmentController(useCase);
};

export const scheduleEmergencuAppointmentController = makeScheduleEmergencyAppointmentController();
