import { describe, expect, it } from 'vitest';

import { makeValidPayload } from './shared-helpers';
import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { ServerError } from '@/domain/errors';
import { PetRepositoryStub, VeterinarianRepositoryStub, AppointmentRepositoryStub, TranslatorStub } from './stubs';

describe('ScheduleEmergencyAppointmentUseCase - System Error Cases', () => {
    it('should return ServerError when pet repository throws an error', async () => {
        const petRepository = new PetRepositoryStub();
        petRepository.setError(new Error('Database connection failed'));
        const veterinarianRepository = new VeterinarianRepositoryStub();
        const appointmentRepository = new AppointmentRepositoryStub();
        const translator = new TranslatorStub();

        const sut = new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, translator);

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Database connection failed');
    });

    it('should return ServerError when veterinarian repository throws an error', async () => {
        const petRepository = new PetRepositoryStub();
        const veterinarianRepository = new VeterinarianRepositoryStub();
        veterinarianRepository.setError(new Error('Database timeout'));
        const appointmentRepository = new AppointmentRepositoryStub();
        const translator = new TranslatorStub();

        const sut = new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, translator);

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Database timeout');
    });

    it('should return ServerError when appointment repository throws an error', async () => {
        const petRepository = new PetRepositoryStub();
        const veterinarianRepository = new VeterinarianRepositoryStub();
        const appointmentRepository = new AppointmentRepositoryStub();
        appointmentRepository.setError(new Error('Failed to create appointment'));
        const translator = new TranslatorStub();

        const sut = new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, translator);

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Failed to create appointment');
    });

    it('should return ServerError when an unexpected error occurs', async () => {
        const petRepository = new PetRepositoryStub();
        const veterinarianRepository = new VeterinarianRepositoryStub();
        const appointmentRepository = new AppointmentRepositoryStub();

        // Create a custom translator that throws an error
        const translator = {
            withLanguage: (_language: string, fn: () => void) => fn(),
            translate: () => {
                throw new Error('Unexpected translation error');
            }
        };

        const sut = new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, translator);

        const payload = {
            ...makeValidPayload(),
            pet_id: 'non-existent-pet-id'
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
        const error = result.value as ServerError;
        expect(error.message).toBe('Unexpected translation error');
    });
});

