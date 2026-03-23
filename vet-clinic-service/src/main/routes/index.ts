/* eslint-disable max-lines-per-function */
import { Service } from '@sap/cds';

import '@/main/config/module-alias';

import { bulkCreatePurchaseOrdersController } from '@/main/factories/controllers/actions/bulk-create-purchase-orders';
import { scheduleEmergencyAppointmentController } from '@/main/factories/controllers/actions/schedule-emergency-appointment';
import { beforeCreateAppointmentController } from '@/main/factories/controllers/entity-events/appointments';
import { afterReadPetsController } from '@/main/factories/controllers/entity-events/pets';
import { afterReadProductsController } from '@/main/factories/controllers/entity-events/products/after-read';
import { beforeCreatePurchaseOrderController } from '@/main/factories/controllers/entity-events/purchase-order';
import { extractProductsToExcelController } from '@/main/factories/controllers/functions/extract-products-to-excel';
import { getOwnerExpenseReportController } from '@/main/factories/controllers/functions/get-owner-expense-report';
import { getVeterinarianScheduleController } from '@/main/factories/controllers/functions/get-veterinarian-schedule';
import { translator } from '@/main/factories/utils/translator';
import { Pets, Products } from '@models/db/models';

export default (service: Service) => {
    service.before('*', async (request: any) => {
        const language = request?.headers['accept-language']?.split(',')[0] || 'en-En';
        request._language = language;
    });

    service.before('CREATE', 'PurchaseOrders', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await beforeCreatePurchaseOrderController.execute(request.data);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            request.data.total = result.data.total;
            request.data.items = result.data.items;
        });
    });

    service.before('CREATE', 'Appointments', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await beforeCreateAppointmentController.execute(request.data);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            request.data = result.data;
        });
    });

    service.on('extractProductsToExcel', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await extractProductsToExcelController.execute();
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            const excelBuffer = result.data;

            const res = request._.res;
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=produtos.xlsx');
            res.setHeader('Content-Length', excelBuffer.length);
            res.setHeader('Cache-Control', 'max-age=0');

            res.end(excelBuffer);
            return;
        });
    });

    service.on('bulkCreatePurchaseOrders', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await bulkCreatePurchaseOrdersController.execute(request.data.payload);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    });

    service.on('scheduleEmergencyAppointment', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await scheduleEmergencyAppointmentController.execute(request.data.payload);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    });

    service.on('getVeterinarianSchedule', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await getVeterinarianScheduleController.execute(request.data.payload);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    });

    service.on('getOwnerExpenseReport', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await getOwnerExpenseReportController.execute(request.data.payload);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    });

    service.after('READ', 'Products', (products: Products, request: any) => {
        return translator.withLanguage(request._language, () => {
            const result = afterReadProductsController.execute(products);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            request.results = result.data as Products;
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
};
