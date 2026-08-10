import { scheduleEmergencyAppointmentUseCase } from "@/main/factories/use-cases/actions";
import { ScheduleEmergencyAppointmentController } from "@/presentation/actions/schedule-emergency-appointment";

const makeScheduleEmergencyAppointmentController = (): ScheduleEmergencyAppointmentController => {
    return new ScheduleEmergencyAppointmentController(scheduleEmergencyAppointmentUseCase);
}

export const scheduleEmergencyAppointmentController = makeScheduleEmergencyAppointmentController();
