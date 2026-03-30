import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { BadRequestError, NotFoundError } from '@/domain/errors';
import { describe, expect, it } from 'vitest';
import {
    createDefaultPet,
    createDefaultTranslator,
    createDefaultVeterinarian
} from '../../../../../fixtures';
import { AppointmentsRepositoryStub } from './appointments-repository-stub';
import { PetsRepositoryStub } from './pet-repository-stub';
import { VeterinariansRepositoryStub } from './veterinarians-repository-stub';

describe('ScheduleEmergencyAppointmentUseCaseImpl validation error cases', () => {
    it.each([
        {
            scenario: 'pet is missing',
            setup: (petRepo: PetsRepositoryStub, vetRepo: VeterinariansRepositoryStub) => {
                vetRepo.addVeterinarian(createDefaultVeterinarian().build());
            },
            expectedError: NotFoundError
        },
        {
            scenario: 'veterinarian is missing',
            setup: (petRepo: PetsRepositoryStub, vetRepo: VeterinariansRepositoryStub) => {
                petRepo.addPet(createDefaultPet().build());
            },
            expectedError: NotFoundError
        }
    ])('should return $scenario error', async ({ setup, expectedError }) => {
        const petRepository = new PetsRepositoryStub();
        const veterinariansRepository = new VeterinariansRepositoryStub();
        const appointmentsRepository = new AppointmentsRepositoryStub();
        const translator = createDefaultTranslator().build();

        setup(petRepository, veterinariansRepository);

        const useCase = new ScheduleEmergencyAppointmentUseCaseImpl(
            petRepository,
            veterinariansRepository,
            appointmentsRepository,
            translator
        );

        const result = await useCase.execute({
            date: new Date(),
            notes: 'emergency',
            pet_id: 'pet-1',
            veterinarian_id: 'vet-1',
            procedures: [{ id: 'proc-1', description: 'Consult', cost: 100 }]
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(expectedError);
    });

    it('should return BadRequestError when procedures list is empty', async () => {
        const petRepository = new PetsRepositoryStub();
        petRepository.addPet(createDefaultPet().build());

        const veterinariansRepository = new VeterinariansRepositoryStub();
        veterinariansRepository.addVeterinarian(createDefaultVeterinarian().build());

        const appointmentsRepository = new AppointmentsRepositoryStub();
        const translator = createDefaultTranslator().build();

        const useCase = new ScheduleEmergencyAppointmentUseCaseImpl(
            petRepository,
            veterinariansRepository,
            appointmentsRepository,
            translator
        );

        const result = await useCase.execute({
            date: new Date(),
            notes: 'emergency',
            pet_id: 'pet-1',
            veterinarian_id: 'vet-1',
            procedures: []
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(BadRequestError);
    });
});
