import { describe, expect, it } from 'vitest';

import { BadRequestError } from '@/domain/errors';
import { makeSut } from './shared-helpers';
import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';

describe('ScheduleEmergencyAppointmentUseCase - Validation Error Cases', () => {
    it('should return error when pet_id is empty', async () => {
        const { sut } = makeSut();
        const payload: ScheduleEmergencyAppointmentUseCase.Params = {
            pet_id: '',
            veterinarian_id: 'valid-vet-id',
            notes: 'Emergência',
            procedures: [{ description: 'Exame', cost: 100 }]
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Pet is required');
    });

    it('should return error when veterinarian_id is empty', async () => {
        const { sut } = makeSut();
        const payload: ScheduleEmergencyAppointmentUseCase.Params = {
            pet_id: 'valid-pet-id',
            veterinarian_id: '',
            notes: 'Emergência',
            procedures: [{ description: 'Exame', cost: 100 }]
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Veterinarian is required');
    });

    it('should return error when procedures array is empty', async () => {
        const { sut } = makeSut();
        const payload: ScheduleEmergencyAppointmentUseCase.Params = {
            pet_id: 'valid-pet-id',
            veterinarian_id: 'valid-vet-id',
            notes: 'Emergência',
            procedures: []
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toBe('No procedures provided');
    });

    it('should return error with multiple validation issues', async () => {
        const { sut } = makeSut();
        const payload: ScheduleEmergencyAppointmentUseCase.Params = {
            pet_id: '',
            veterinarian_id: '',
            notes: 'Emergência',
            procedures: [{ description: 'Exame', cost: 100 }]
        };

        const result = await sut.execute(payload);

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(BadRequestError);
        const error = result.value as BadRequestError;
        expect(error.message).toContain('Pet is required');
        expect(error.message).toContain('Veterinarian is required');
    });
});

