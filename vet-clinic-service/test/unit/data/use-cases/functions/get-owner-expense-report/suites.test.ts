import { describe, expect, it } from 'vitest';
import { GetOwnerExpenseReportUseCaseImpl } from '@/data/use-cases/functions/get-owner-expense-report';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { OwnerModel } from '@/domain/models/db/owner';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { OwnerRepositoryStub, AppointmentRepositoryStub, TranslatorStub } from './stubs';
import { OwnerExpenseReportModel } from '@/domain/models/db/owner-expense-report';

// ========================================
// HELPER FUNCTIONS
// ========================================

type SutTypes = {
    ownerRepository: OwnerRepositoryStub;
    appointmentRepository: AppointmentRepositoryStub;
    translator: TranslatorStub;
    sut: GetOwnerExpenseReportUseCaseImpl;
};

const makeSut = (overrides: Partial<Omit<SutTypes, 'sut'>> = {}): SutTypes => {
    const ownerRepository = overrides.ownerRepository ?? new OwnerRepositoryStub();
    const appointmentRepository = overrides.appointmentRepository ?? new AppointmentRepositoryStub();
    const translator = overrides.translator ?? new TranslatorStub();

    const sut = new GetOwnerExpenseReportUseCaseImpl(ownerRepository, appointmentRepository, translator);

    return {
        ownerRepository,
        appointmentRepository,
        translator,
        sut
    };
};

const makeValidParams = () => ({
    ownerId: 'valid-owner-id'
});

const makeOwner = () => {
    return OwnerModel.create({
        id: 'valid-owner-id',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '123456789',
        email: 'jane@example.com'
    });
};

const makeAppointment = (overrides: Partial<any> = {}) => {
    return AppointmentModel.create({
        id: 'appointment-id',
        date: new Date().toISOString(),
        status: 'COMPLETED',
        isEmergency: false,
        totalCost: 100,
        notes: 'Regular checkup',
        pet_id: 'pet-id',
        veterinarian_id: 'vet-id',
        procedures: [],
        ...overrides
    });
};

// ========================================
// TEST SUITES
// ========================================

describe('GetOwnerExpenseReportUseCase', () => {
    // ========================================
    // SUCCESS CASES
    // ========================================
    describe('Success Cases', () => {
        it('should return expense report when owner has completed appointments', async () => {
            const { sut, ownerRepository, appointmentRepository } = makeSut();

            const owner = makeOwner();
            const appointment1 = makeAppointment({ id: 'app-1', totalCost: 100 });
            const appointment2 = makeAppointment({ id: 'app-2', totalCost: 200 });
            const appointment3 = makeAppointment({ id: 'app-3', totalCost: 300 });

            ownerRepository.owners.push(owner);
            appointmentRepository.appointmentsByOwner.set('valid-owner-id', [appointment1, appointment2, appointment3]);

            const { ownerId } = makeValidParams();
            const result = await sut.execute(ownerId);

            expect(result.isRight()).toBeTruthy();
            const report = result.value as OwnerExpenseReportModel;
            expect(report.ownerId).toBe('valid-owner-id');
            expect(report.ownerFullName).toBe('Jane Smith');
        });

        it('should calculate total expenses correctly', async () => {
            const { sut, ownerRepository, appointmentRepository } = makeSut();

            const owner = makeOwner();
            const appointment1 = makeAppointment({ id: 'app-1', totalCost: 100 });
            const appointment2 = makeAppointment({ id: 'app-2', totalCost: 200 });
            const appointment3 = makeAppointment({ id: 'app-3', totalCost: 300 });

            ownerRepository.owners.push(owner);
            appointmentRepository.appointmentsByOwner.set('valid-owner-id', [appointment1, appointment2, appointment3]);

            const { ownerId } = makeValidParams();
            const result = await sut.execute(ownerId);

            expect(result.isRight()).toBeTruthy();
            const report = result.value as OwnerExpenseReportModel;
            expect(report.totalExpenses).toBe(600);
        });

        it('should calculate average cost correctly', async () => {
            const { sut, ownerRepository, appointmentRepository } = makeSut();

            const owner = makeOwner();
            const appointment1 = makeAppointment({ id: 'app-1', totalCost: 100 });
            const appointment2 = makeAppointment({ id: 'app-2', totalCost: 200 });
            const appointment3 = makeAppointment({ id: 'app-3', totalCost: 300 });

            ownerRepository.owners.push(owner);
            appointmentRepository.appointmentsByOwner.set('valid-owner-id', [appointment1, appointment2, appointment3]);

            const { ownerId } = makeValidParams();
            const result = await sut.execute(ownerId);

            expect(result.isRight()).toBeTruthy();
            const report = result.value as OwnerExpenseReportModel;
            expect(report.averageCost).toBe(200);
        });

        it('should count appointments correctly', async () => {
            const { sut, ownerRepository, appointmentRepository } = makeSut();

            const owner = makeOwner();
            const appointments = [
                makeAppointment({ id: 'app-1', totalCost: 100 }),
                makeAppointment({ id: 'app-2', totalCost: 150 }),
                makeAppointment({ id: 'app-3', totalCost: 200 }),
                makeAppointment({ id: 'app-4', totalCost: 250 }),
                makeAppointment({ id: 'app-5', totalCost: 300 })
            ];

            ownerRepository.owners.push(owner);
            appointmentRepository.appointmentsByOwner.set('valid-owner-id', appointments);

            const { ownerId } = makeValidParams();
            const result = await sut.execute(ownerId);

            expect(result.isRight()).toBeTruthy();
            const report = result.value as OwnerExpenseReportModel;
            expect(report.appointmentCount).toBe(5);
        });
    });

    // ========================================
    // VALIDATION ERROR CASES
    // ========================================
    describe('Validation Error Cases', () => {
        it('should return BadRequestError when ownerId is empty', async () => {
            const { sut } = makeSut();

            const result = await sut.execute('');

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(BadRequestError);
            const error = result.value as BadRequestError;
            expect(error.message).toBe('Owner is required');
        });
    });

    // ========================================
    // BUSINESS LOGIC ERROR CASES
    // ========================================
    describe('Business Logic Error Cases', () => {
        it('should return NotFoundError when owner does not exist', async () => {
            const { sut } = makeSut();

            const { ownerId } = makeValidParams();
            const result = await sut.execute(ownerId);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(NotFoundError);
            const error = result.value as NotFoundError;
            expect(error.message).toBe('Owner not found');
        });

        it('should return NotFoundError when owner has no completed appointments', async () => {
            const { sut, ownerRepository } = makeSut();

            const owner = makeOwner();
            ownerRepository.owners.push(owner);

            const { ownerId } = makeValidParams();
            const result = await sut.execute(ownerId);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(NotFoundError);
            const error = result.value as NotFoundError;
            expect(error.message).toBe('No completed appointments found for this owner');
        });
    });

    // ========================================
    // SYSTEM ERROR CASES
    // ========================================
    describe('System Error Cases', () => {
        it('should throw error when an unexpected error occurs during owner retrieval', async () => {
            const { sut, ownerRepository } = makeSut();

            // Force ownerRepository to throw an error
            ownerRepository.findById = async () => {
                throw new Error('Database connection error');
            };

            const { ownerId } = makeValidParams();

            await expect(sut.execute(ownerId)).rejects.toThrow('Database connection error');
        });
    });
});
