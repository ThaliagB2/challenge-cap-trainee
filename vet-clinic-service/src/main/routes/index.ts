/* eslint-disable max-lines-per-function */
import '../config/module-alias';

import { Service } from '@sap/cds';

import { Pets, Products } from '@models/db/models';

import { translator } from '@/main/factories/utils/translator';

import { bulkCreatePurchaseOrdersController } from '@/main/factories/controllers/actions/bulk-create-purchase-orders';
import { scheduleEmergencyAppointmentController } from '@/main/factories/controllers/actions/schedule-emergency-appointment';
import { beforeCreateAppointmentController } from '@/main/factories/controllers/entity-events/appointments';
import { afterReadPetsController } from '@/main/factories/controllers/entity-events/pets/after-read';
import { afterReadProductsController } from '@/main/factories/controllers/entity-events/products/after-read';
import { getVeterinarianScheduleItemController } from '@/main/factories/controllers/functions';
import { extractProductsToExcelController } from '@/main/factories/controllers/functions/extract-products-to-excel';

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

    service.after('READ', 'Products', (products: Products, request: any) => {
        return translator.withLanguage(request._language, () => {
            const result = afterReadProductsController.execute(products);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            request.results = result.data as Products;
        });
    });

    service.after('READ', 'Pets', (pets: Pets, request:any) => {
        return translator.withLanguage(request._language, () => {
            const result = afterReadPetsController.execute(pets);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            request.results = result.data as Pets;
        })
    })

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

    service.on('getVeterinarianScheduleItem', async (request: any) => {
        return translator.withLanguage(request._language, async () => {
            const result = await getVeterinarianScheduleItemController.execute({veterinarian_id: request.data.veterinarian_id, days: request.data.days || 7});
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    })

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
            const result = await scheduleEmergencyAppointmentController.execute(request.data.params);
            if (result.status >= 400) {
                return request.reject(result.errorData);
            }
            return result.data;
        });
    })
};
