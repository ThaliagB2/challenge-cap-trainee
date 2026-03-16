import { describe, expect, it } from 'vitest';
import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { PetModel } from '@/domain/models/db/pet';
import { OwnerModel } from '@/domain/models/db/owner';
import { ProcedureModel } from '@/domain/models/db/procedure';
import {
    VeterinarianRepositoryStub,
    AppointmentRepositoryStub,
    PetRepositoryStub,
    OwnerRepositoryStub,
    ProcedureRepositoryStub,
    TranslatorStub
} from './stubs';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';

// ========================================
// HELPER FUNCTIONS
// ========================================

type SutTypes = {
    veterinarianRepository: VeterinarianRepositoryStub;
    appointmentRepository: AppointmentRepositoryStub;
    petRepository: PetRepositoryStub;
    ownerRepository: OwnerRepositoryStub;
    procedureRepository: ProcedureRepositoryStub;
    translator: TranslatorStub;
    sut: GetVeterinarianScheduleUseCaseImpl;
};

const makeSut = (overrides: Partial<Omit<SutTypes, 'sut'>> = {}): SutTypes => {
    const veterinarianRepository = overrides.veterinarianRepository ?? new VeterinarianRepositoryStub();
    const appointmentRepository = overrides.appointmentRepository ?? new AppointmentRepositoryStub();
    const petRepository = overrides.petRepository ?? new PetRepositoryStub();
    const ownerRepository = overrides.ownerRepository ?? new OwnerRepositoryStub();
    const procedureRepository = overrides.procedureRepository ?? new ProcedureRepositoryStub();
    const translator = overrides.translator ?? new TranslatorStub();

    const sut = new GetVeterinarianScheduleUseCaseImpl(
        veterinarianRepository,
        appointmentRepository,
        petRepository,
        ownerRepository,
        procedureRepository,
        translator
    );

    return {
        veterinarianRepository,
        appointmentRepository,
        petRepository,
        ownerRepository,
        procedureRepository,
        translator,
        sut
    };
};

const makeValidParams = () => ({
    veterinarianId: 'valid-vet-id',
    days: 7
});

const makeVeterinarian = () => {
    return VeterinarianModel.create({
        id: 'valid-vet-id',
        firstName: 'Dr. John',
        lastName: 'Doe',
        specialty: 'General',
        crmv: 'CRMV-12345'
    });
};

const makeOwner = () => {
    return OwnerModel.create({
        id: 'owner-id',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '123456789',
        email: 'jane@example.com'
    });
};

const makePet = () => {
    return PetModel.create({
        id: 'pet-id',
        name: 'Rex',
        species: 'Dog',
        breed: 'Labrador',
        birthDate: new Date('2020-01-01'),
        weight: 25.5,
        owner_id: 'owner-id'
    });
};

const makeAppointment = (overrides: Partial<any> = {}) => {
    const today = new Date();
    return AppointmentModel.create({
        id: 'appointment-id',
        date: today.toISOString(),
        status: 'SCHEDULED',
        isEmergency: false,
        totalCost: 150,
        notes: 'Regular checkup',
        pet_id: 'pet-id',
        veterinarian_id: 'valid-vet-id',
        procedures: [],
        ...overrides
    });
};

const makeProcedure = () => {
    return ProcedureModel.create({
        id: 'procedure-id',
        description: 'Vaccination',
        cost: 50
    });
};

// ========================================
// TEST SUITES
// ========================================

describe('GetVeterinarianScheduleUseCase', () => {
    // ========================================
    // SUCCESS CASES
    // ========================================
    describe('Success Cases', () => {
        it('should return veterinarian schedule when all data exists', async () => {
            const { sut, veterinarianRepository, appointmentRepository, petRepository, ownerRepository, procedureRepository } = makeSut();

            const veterinarian = makeVeterinarian();
            const owner = makeOwner();
            const pet = makePet();
            const appointment = makeAppointment();
            const procedure = makeProcedure();

            veterinarianRepository.veterinarians.push(veterinarian);
            ownerRepository.owners.push(owner);
            petRepository.pets.push(pet);
            appointmentRepository.appointments.push(appointment);
            procedureRepository.procedures.set('appointment-id', [procedure]);

            const { veterinarianId, days } = makeValidParams();
            const result = await sut.execute(veterinarianId, days);

            expect(result.isRight()).toBeTruthy();
            const schedule = result.value as VeterinarianScheduleModel[];
            expect(Array.isArray(schedule)).toBeTruthy();
            expect(schedule).toHaveLength(1);
            expect(schedule[0].id).toBe('appointment-id');
        });

        it('should return schedule with multiple appointments', async () => {
            const { sut, veterinarianRepository, appointmentRepository, petRepository, ownerRepository, procedureRepository } = makeSut();

            const veterinarian = makeVeterinarian();
            const owner = makeOwner();
            const pet = makePet();
            const procedure = makeProcedure();

            const appointment1 = makeAppointment({ id: 'appointment-1' });
            const appointment2 = makeAppointment({ id: 'appointment-2' });
            const appointment3 = makeAppointment({ id: 'appointment-3' });

            veterinarianRepository.veterinarians.push(veterinarian);
            ownerRepository.owners.push(owner);
            petRepository.pets.push(pet);
            appointmentRepository.appointments.push(appointment1, appointment2, appointment3);
            procedureRepository.procedures.set('appointment-1', [procedure]);
            procedureRepository.procedures.set('appointment-2', [procedure]);
            procedureRepository.procedures.set('appointment-3', [procedure]);

            const { veterinarianId, days } = makeValidParams();
            const result = await sut.execute(veterinarianId, days);

            expect(result.isRight()).toBeTruthy();
            const schedule = result.value;
            expect(schedule).toHaveLength(3);
        });

        it('should calculate date range correctly', async () => {
            const { sut, veterinarianRepository, appointmentRepository, petRepository, ownerRepository, procedureRepository } = makeSut();

            const veterinarian = makeVeterinarian();
            const owner = makeOwner();
            const pet = makePet();
            const procedure = makeProcedure();

            const today = new Date();
            const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const pastDate = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);

            const appointmentInRange = makeAppointment({ id: 'in-range', date: today.toISOString() });
            const appointmentOutOfRange = makeAppointment({ id: 'out-of-range', date: pastDate.toISOString() });

            veterinarianRepository.veterinarians.push(veterinarian);
            ownerRepository.owners.push(owner);
            petRepository.pets.push(pet);
            appointmentRepository.appointments.push(appointmentInRange, appointmentOutOfRange);
            procedureRepository.procedures.set('in-range', [procedure]);
            procedureRepository.procedures.set('out-of-range', [procedure]);

            const { veterinarianId, days } = makeValidParams();
            const result = await sut.execute(veterinarianId, days);

            expect(result.isRight()).toBeTruthy();
            const schedule = result.value as VeterinarianScheduleModel[];
            expect(schedule).toHaveLength(1);
            expect(schedule[0].id).toBe('in-range');
        });
    });

    // ========================================
    // VALIDATION ERROR CASES
    // ========================================
    describe('Validation Error Cases', () => {
        it('should return BadRequestError when veterinarianId is empty', async () => {
            const { sut } = makeSut();

            const result = await sut.execute('', 7);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(BadRequestError);
            const error = result.value as BadRequestError;
            expect(error.message).toBe('Veterinarian is required');
        });
    });

    // ========================================
    // BUSINESS LOGIC ERROR CASES
    // ========================================
    describe('Business Logic Error Cases', () => {
        it('should return NotFoundError when veterinarian does not exist', async () => {
            const { sut } = makeSut();

            const { veterinarianId, days } = makeValidParams();
            const result = await sut.execute(veterinarianId, days);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(NotFoundError);
            const error = result.value as NotFoundError;
            expect(error.message).toBe('Veterinarian not found');
        });

        it('should return NotFoundError when no appointments found in period', async () => {
            const { sut, veterinarianRepository } = makeSut();

            const veterinarian = makeVeterinarian();
            veterinarianRepository.veterinarians.push(veterinarian);

            const { veterinarianId, days } = makeValidParams();
            const result = await sut.execute(veterinarianId, days);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(NotFoundError);
            const error = result.value as NotFoundError;
            expect(error.message).toBe('No appointments found for this veterinarian in the specified period');
        });
    });

    // ========================================
    // SYSTEM ERROR CASES
    // ========================================
    describe('System Error Cases', () => {
        it('should throw error when an unexpected error occurs during pet retrieval', async () => {
            const { sut, veterinarianRepository, appointmentRepository, petRepository } = makeSut();

            const veterinarian = makeVeterinarian();
            const appointment = makeAppointment();

            veterinarianRepository.veterinarians.push(veterinarian);
            appointmentRepository.appointments.push(appointment);

            // Force petRepository to throw an error
            petRepository.findById = async (id: string) => {
                throw new Error('Database connection error');
            };

            const { veterinarianId, days } = makeValidParams();

            await expect(sut.execute(veterinarianId, days)).rejects.toThrow();
        });
    });
});

