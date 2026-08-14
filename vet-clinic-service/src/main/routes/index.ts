/* eslint-disable max-lines-per-function */
import '../config/module-alias';

import { Service } from '@sap/cds';

import { translator } from '@/main/factories/utils/translator';

import { scheduleEmergencyAppointmentController } from '@/main/factories/controllers/actions/schedule-emergency-appointment';
import { beforeCreateAppointmentController } from '@/main/factories/controllers/entity-events/appointments/before-create';
import { afterReadPetsController } from '@/main/factories/controllers/entity-events/pets/after-read';
import { getOwnerExpenseReportController } from '@/main/factories/controllers/functions/get-owner-expense-report';
import { getVeterinarianScheduleController } from '@/main/factories/controllers/functions/get-veterinarian-schedule';

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

            Object.assign(request.data, result.data);
        });
    });

    service.after('READ', 'Pets', (pets: any[], request: any) => {
        return translator.withLanguage(request._language, () => {
            const result = afterReadPetsController.execute(pets);

            if (result.status >= 400) {
                return request.reject(result.errorData);
            }

            request.results = result.data;
        });
    });

    service.on('scheduleEmergencyAppointment', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await scheduleEmergencyAppointmentController.execute(request.data);

            if (result.status >= 400) {
                return request.reject(result.errorData);
            }

            return result.data;
        });
    });

    service.on('getVeterinarianSchedule', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await getVeterinarianScheduleController.execute(request.data);

            if (result.status >= 400) {
                return request.reject(result.errorData);
            }

            return result.data;
        });
    });

    service.on('getOwnerExpenseReport', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await getOwnerExpenseReportController.execute(request.data);

            if (result.status >= 400) {
                return request.reject(result.errorData);
            }

            return result.data;
        });
    });
};
