/* eslint-disable max-lines-per-function */
import '../config/module-alias';

import { Service } from '@sap/cds';

import { scheduleEmergencyAppointmentController } from '@/main/factories/controllers/actions/schedule-emergency-appointment';
import { beforeCreateAppointmentController } from '@/main/factories/controllers/entity-events/appointments';
import { afterReadPetsController } from '@/main/factories/controllers/entity-events/pets/after-read';
import { getVeterinarianScheduleItemController } from '@/main/factories/controllers/functions';
import { translator } from '@/main/factories/utils/translator';
import { Pets } from '@models/db/models';

export default (service: Service) => {
    service.before('*', async (request: any) => {
        const language = request?.headers['accept-language']?.split(',')[0] || 'en-En';
        request._language = language;
    });

    service.before('CREATE', 'Appointments', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await beforeCreateAppointmentController.execute(request.data);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return Object.assign(request.data, result.data);
        });
    });

    service.after('READ', 'Pets', (pets: Pets, request: any) => {
        return translator.withLanguage(request._language, () => {
            const result = afterReadPetsController.execute(pets);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            request.results = result.data as Pets;
        });
    });

    service.on('getVeterinarianScheduleItem', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await getVeterinarianScheduleItemController.execute({ veterinarian_id: request.data.veterinarian_id, days: request.data.days || 7 });
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    });

    service.on('scheduleEmergencyAppointment', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await scheduleEmergencyAppointmentController.execute(request.data.params);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    });
};
