import { BeforeCreateAppointmentsUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { describe, expect, it } from 'vitest';
import {
    createDefaultPet,
    createDefaultVeterinarian
} from '../../../../fixtures';
import { PetsRepositoryStub, TranslatorStub, VeterinariansRepositoryStub } from './stubs';

describe('BeforeCreateAppointmentsUseCaseImpl', () => {
    it('returns NotFoundError when pet missing', async () => {
        const petsRepository = new PetsRepositoryStub();
        const veterinariansRepository = new VeterinariansRepositoryStub();
        const defaultVet = createDefaultVeterinarian().build();
        veterinariansRepository.addVeterinarian(defaultVet);
        const translator = new TranslatorStub();

        const useCase = new BeforeCreateAppointmentsUseCaseImpl(
            petsRepository,
            veterinariansRepository,
            translator
        );

        const result = await useCase.execute({
            id: 'a',
            date: new Date(),
            status: 'SCHEDULED',
            isEmergency: false,
            totalCost: 0,
            notes: 'x',
            pet_id: 'pet-1',
            veterinarian_id: defaultVet.id,
            procedures: [{ id: 'proc-1', description: 'x', cost: 100 }]
        } as any);

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('returns BadRequestError when procedures empty', async () => {
        const petsRepository = new PetsRepositoryStub();
        const defaultPet = createDefaultPet().build();
        petsRepository.addPet(defaultPet);
        
        const veterinariansRepository = new VeterinariansRepositoryStub();
        const defaultVet = createDefaultVeterinarian().build();
        veterinariansRepository.addVeterinarian(defaultVet);
        
        const translator = new TranslatorStub();

        const useCase = new BeforeCreateAppointmentsUseCaseImpl(
            petsRepository,
            veterinariansRepository,
            translator
        );

        const result = await useCase.execute({
            id: 'a',
            date: new Date(),
            status: 'SCHEDULED',
            isEmergency: false,
            totalCost: 0,
            notes: 'x',
            pet_id: defaultPet.id,
            veterinarian_id: defaultVet.id,
            procedures: []
        } as any);

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(BadRequestError);
    });
});
