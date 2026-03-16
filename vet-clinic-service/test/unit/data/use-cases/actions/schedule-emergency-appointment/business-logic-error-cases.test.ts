import { describe, expect, it } from 'vitest';

import { NotFoundError } from '@/domain/errors';
import { makeValidPayload, makeSut } from './shared-helpers';
import { PetRepositoryStub, VeterinarianRepositoryStub } from './stubs';

describe('ScheduleEmergencyAppointmentUseCase - Business Logic Error Cases', () => {
    it('should return error when pet does not exist', async () => {
        const { sut } = makeSut();
        const payload = {
            ...makeValidPayload(),
            pet_id: 'non-existent-pet-id'
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
        const error = result.value as NotFoundError;
        expect(error.message).toBe('Pet not found');
    });

    it('should return error when veterinarian does not exist', async () => {
        const { sut } = makeSut();
        const payload = {
            ...makeValidPayload(),
            veterinarian_id: 'non-existent-vet-id'
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
        const error = result.value as NotFoundError;
        expect(error.message).toBe('Veterinarian not found');
    });

    it('should return error when both pet and veterinarian do not exist', async () => {
        const { sut } = makeSut();
        const payload = {
            ...makeValidPayload(),
            pet_id: 'non-existent-pet-id',
            veterinarian_id: 'non-existent-vet-id'
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
        const error = result.value as NotFoundError;
        expect(error.message).toBe('Pet not found');
    });

    it('should return error when pet repository returns null', async () => {
        const petRepository = new PetRepositoryStub();
        petRepository.findById = async () => null;
        const { sut } = makeSut({ petRepository });

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
        const error = result.value as NotFoundError;
        expect(error.message).toBe('Pet not found');
    });

    it('should return error when veterinarian repository returns null', async () => {
        const veterinarianRepository = new VeterinarianRepositoryStub();
        veterinarianRepository.findById = async () => null;
        const { sut } = makeSut({ veterinarianRepository });

        const result = await sut.execute(makeValidPayload());

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
        const error = result.value as NotFoundError;
        expect(error.message).toBe('Veterinarian not found');
    });
});

