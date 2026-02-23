import '../config/module-alias';

import { Request, Service } from '@sap/cds';

import { afterReadPetController } from '../factories/controllers/entity-events/pet';
import { beforeCreateAppointmentController } from '../factories/controllers/entity-events/appointment';
import { getOwnerExpenseReportController } from '../factories/controllers/functions/get-owner-expense-report';
import { getVeterinarianScheduleController } from '../factories/controllers/functions/get-veterinarian-schedule';
import { scheduleEmergencyAppointmentController } from '../factories/controllers/actions/schedule-emergency-appointment';

// eslint-disable-next-line max-lines-per-function
export default (service: Service) => {
    service.before('CREATE', 'Appointments', async (req: Request) => {
        const params = req.data;
        const result = await beforeCreateAppointmentController.execute(params);

        if (result.status === 200) {
            req.data = result.data;
        } else {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            req.reject(result.status, errorMessages);
        }
    });

    service.after('READ', 'Pets', async (results, req) => {
        if (!results || results.length === 0) {
            return results;
        }

        const result = await afterReadPetController.execute(results);

        if (result.status === 200) {
            req.data = result.data;
        } else {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            req.reject(result.status, errorMessages);
        }
    });

    service.on('scheduleEmergencyAppointment', async (req: Request) => {
        const result = await scheduleEmergencyAppointmentController.execute(req.data);

        if (result.status === 200) {
            req.data = result.data;
        } else {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            req.reject(result.status, errorMessages);
        }
    });

    service.on('getVeterinarianSchedule', async (req: Request) => {
        const result = await getVeterinarianScheduleController.execute(req.data[0].veterinarianId, req.data[0].days);

        if (result.status === 200) {
            req.data = result.data;
        } else {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            req.reject(result.status, errorMessages);
        }
    });

    service.on('getOwnerExpenseReport', async (req: Request) => {
        const result = await getOwnerExpenseReportController.execute(req.data[0].ownerId);
        if (result.status === 200) {
            req.data = result.data;
        } else {
            const errorMessages = result.errorData?.details.map((detail) => detail.message).join('; ');
            req.reject(result.status, errorMessages);
        }
    });
};
