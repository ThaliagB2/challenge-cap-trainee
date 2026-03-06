import '../config/module-alias';

import { Request, Service } from '@sap/cds';

import { afterReadPetController } from '@/main/factories/controllers/entity-events/pet';
import { beforeCreateAppointmentController } from '@/main/factories/controllers/entity-events/appointment';
import { getOwnerExpenseReportController } from '@/main/factories/controllers/functions/get-owner-expense-report';
import { getVeterinarianScheduleController } from '@/main/factories/controllers/functions/get-veterinarian-schedule';
import { scheduleEmergencyAppointmentController } from '@/main/factories/controllers/actions/schedule-emergency-appointment';
import { PetWithAgeProps } from '@/domain/models/db/pet';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';

// eslint-disable-next-line max-lines-per-function
export default (service: Service) => {
    service.before('CREATE', 'Appointments', async (req: Request) => {
        const params = req.data;
        const result = await beforeCreateAppointmentController.execute(params);

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data;
    });

    service.after('READ', 'Pets', async (petList, req) => {
        if (!petList) {
            return;
        }

        const isArray = Array.isArray(petList);
        const petsArray = isArray ? petList : [petList];

        if (petsArray.length === 0) {
            return;
        }

        const result = await afterReadPetController.execute(petsArray);

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data.forEach((petWithAge: PetWithAgeProps, index: number) => {
            petsArray[index].age = petWithAge.age;
        });
    });

    service.on('scheduleEmergencyAppointment', async (req: Request) => {
        const result = await scheduleEmergencyAppointmentController.execute({
            pet_id: req.data.payload.petId,
            veterinarian_id: req.data.payload.veterinarianId,
            notes: req.data.payload.notes,
            procedures: req.data.payload.procedures
        });

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data;
    });

    service.on('getVeterinarianSchedule', async (req: Request) => {
        const days: number = req.data.days || 7;

        const result = await getVeterinarianScheduleController.execute(req.data.veterinarianId, days);

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        const appointments = result.data.map((appointment: VeterinarianScheduleModel) => appointment.toObject());
        return appointments;
    });

    service.on('getOwnerExpenseReport', async (req: Request) => {
        const result = await getOwnerExpenseReportController.execute(req.data.ownerId);

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data;
    });
};
