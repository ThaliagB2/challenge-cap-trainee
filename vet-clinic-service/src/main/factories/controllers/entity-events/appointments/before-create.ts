import { beforeCreateAppointmentUseCase } from "@/main/factories/use-cases/entity-events/appointments/before-create";
import { BeforeCreateAppointmentController } from "@/presentation/entity-events/appointments";

const makeBeforeCreateAppointmentController = (): BeforeCreateAppointmentController => {
    return new BeforeCreateAppointmentController(beforeCreateAppointmentUseCase)
}

export const beforeCreateAppointmentController = makeBeforeCreateAppointmentController();