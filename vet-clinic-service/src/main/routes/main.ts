/* eslint-disable max-lines-per-function */
import '../config/module-alias';

import { Request, Service } from '@sap/cds';

import { scheduleEmergencyAppointmentController } from '@/main/factories/controllers/actions/schedule-emergency-appointment';
import { beforeCreateAppointmentController } from '@/main/factories/controllers/entity-events/appointments';
import { afterReadPetsController } from '@/main/factories/controllers/entity-events/pets/after-read';
import { getOwnerExpenseReportController, getVeterinarianScheduleItemController } from '@/main/factories/controllers/functions';
import { Pets } from '@models/db/models';

export default (service: Service) => {
    service.before('CREATE', 'Appointments', async (request: Request) => {
        const result = await beforeCreateAppointmentController.execute(request.data, request.locale);
        if (result.status >= 400) {
            return request.reject(result.errorData);
        }
        return Object.assign(request.data, result.data);
    });

    service.after('READ', 'Pets', (pets: Pets, request: Request) => {
        const result = afterReadPetsController.execute(pets, request.locale);
        if (result.status >= 400) {
            return request.reject(result.errorData);
        }
        const Pets = result.data as Pets[];
        pets.forEach((pet, i) => Object.assign(pet, Pets[i]));
    });

    service.on('getVeterinarianScheduleItem', async (request: Request) => {
        const result = await getVeterinarianScheduleItemController.execute({ veterinarian_id: request.data.veterinarian_id, days: request.data.days || 7 }, request.locale);
        if (result.status >= 400) {
            return request.reject(result.errorData);
        }
        return result.data;
    });

    service.on('getOwnerExpenseReport', async (request: Request) => {
        const result = await getOwnerExpenseReportController.execute(request.data.owner_id, request.locale);
        if (result.status >= 400) {
            return request.reject(result.errorData);
        }
        return result.data;
    });

    service.on('scheduleEmergencyAppointment', async (request: Request) => {
        const result = await scheduleEmergencyAppointmentController.execute(request.data.params, request.locale);
        if (result.status >= 400) return request.reject(result.errorData);
        return result.data;
    });
};
