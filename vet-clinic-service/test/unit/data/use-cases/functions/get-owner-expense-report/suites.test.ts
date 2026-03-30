import { GetOwnerExpenseReportImpl } from '@/data/use-cases/functions/get-owner-expense-report';
import { NotFoundError } from '@/domain/errors';
import { OwnerExpenseReport } from '@/domain/models/db/get-owner-expense-report';
import { OwnersModel } from '@/domain/models/db/owners';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultAppointment } from '../../../../fixtures';
import { AppointmentsRepositoryStub, OwnersRepositoryStub, TranslatorStub } from './stubs';

describe('GetOwnerExpenseReportImpl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns NotFoundError when owner does not exist', async () => {
        const ownerRepository = new OwnersRepositoryStub();
        const appointmentRepository = new AppointmentsRepositoryStub();
        const translator = new TranslatorStub();

        const useCase = new GetOwnerExpenseReportImpl(ownerRepository, appointmentRepository, translator);
        const result = await useCase.execute({ ownerId: 'owner-1' });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('returns NotFoundError when owner has no appointments', async () => {
        const owner = OwnersModel.create({
            id: 'owner-1',
            firstName: 'John',
            lastName: 'Doe',
            phone: '123',
            email: 'john@test.com'
        });

        const ownerRepository = new OwnersRepositoryStub();
        ownerRepository.addOwner(owner);
        
        const appointmentRepository = new AppointmentsRepositoryStub();
        const translator = new TranslatorStub();

        const useCase = new GetOwnerExpenseReportImpl(ownerRepository, appointmentRepository, translator);
        const result = await useCase.execute({ ownerId: 'owner-1' });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('returns right report when there is completed appointments', async () => {
        const owner = OwnersModel.create({
            id: 'owner-1',
            firstName: 'John',
            lastName: 'Doe',
            phone: '123',
            email: 'john@test.com'
        });

        const ownerRepository = new OwnersRepositoryStub();
        ownerRepository.addOwner(owner);

        const appointmentRepository = new AppointmentsRepositoryStub();
        const appointment1 = createDefaultAppointment()
            .withId('a1')
            .withStatus('COMPLETED')
            .withTotalCost(100)
            .build();
        
        const appointment2 = createDefaultAppointment()
            .withId('a2')
            .withStatus('COMPLETED')
            .withTotalCost(200)
            .build();

        const map = new Map<string, typeof appointment1[]>();
        map.set('owner-1', [appointment1, appointment2]);
        appointmentRepository.setupAppointmentsByOwner(map);

        const translator = new TranslatorStub();

        const useCase = new GetOwnerExpenseReportImpl(ownerRepository, appointmentRepository, translator);
        const result = await useCase.execute({ ownerId: 'owner-1' });

        expect(result.isRight()).toBe(true);

        const report = result.value as OwnerExpenseReport;

        expect(report.ownerId).toBe('owner-1');
        expect(report.totalExpenses).toBe(300);
        expect(report.appointmentCount).toBe(2);
        expect(report.averageCost).toBe(150);
    });
});