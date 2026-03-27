import { PetsAgeProps } from '@/domain/models/db/pets';
import { Request, Service } from '@sap/cds';
import { scheduleEmergencyAppointmentController } from '../factories/controllers/actions/schedule-emergency-appointment';
import { beforeCreateAppointmentController } from '../factories/controllers/entity-events/appointments';
import { afterReadPetController } from '../factories/controllers/entity-events/pets';
import { getOwnerExpenseReportController } from '../factories/controllers/functions/get-owner-expense-report';
import { getVeterinarianScheduleController } from '../factories/controllers/functions/get-veterinarian-schedule';

// eslint-disable-next-line max-lines-per-function
export default (service: Service) => {
    service.before('CREATE', 'Appointments', async (req: Request) => {
        const params = req.data;
        const result = await beforeCreateAppointmentController.execute(params);

        if (result.status >= 400) {
            const errorMensage = result.errorData.details.map((details) => details.message).join('; ');
            return req.reject(result.status, errorMensage);
        }
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

        return result.data.forEach((petWithAge: PetsAgeProps, index: number) => {
            petsArray[index].age = petWithAge.age;
        });
    });

    service.on('scheduleEmergencyAppointment', async (req: Request) => {
        const result = await scheduleEmergencyAppointmentController.execute({
            date: req.data.params.date || new Date(),
            pet_id: req.data.params.petId,
            veterinarian_id: req.data.params.veterinarianId,
            notes: req.data.params.notes,
            procedures: req.data.params.procedures
        });

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data;
    });

    service.on('getOwnerExpenseReport', async (req: Request) => {
        const result = await getOwnerExpenseReportController.execute(req.data.payload);

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data;
    });

    service.on('getVeterinarianSchedule', async (req: Request) => {
        const result = await getVeterinarianScheduleController.execute(req.data.payload);

        if (result.status >= 400) {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            return req.reject(result.status, errorMessages);
        }

        return result.data;
    });
};
