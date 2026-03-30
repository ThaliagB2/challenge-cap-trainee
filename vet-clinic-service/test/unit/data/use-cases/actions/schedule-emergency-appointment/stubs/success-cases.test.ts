import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { describe, expect, it } from 'vitest';
import {
    createDefaultPet,
    createDefaultTranslator,
    createDefaultVeterinarian
} from '../../../../../fixtures';
import { AppointmentsRepositoryStub } from './appointments-repository-stub';
import { PetsRepositoryStub } from './pet-repository-stub';
import { VeterinariansRepositoryStub } from './veterinarians-repository-stub';

describe('ScheduleEmergencyAppointmentUseCaseImpl success cases', () => {
    it('should create an emergency appointment and return right', async () => {
        const petRepository = new PetsRepositoryStub();
        const defaultPet = createDefaultPet().build();
        petRepository.addPet(defaultPet);

        const veterinariansRepository = new VeterinariansRepositoryStub();
        const defaultVeterinarian = createDefaultVeterinarian().build();
        veterinariansRepository.addVeterinarian(defaultVeterinarian);

        const appointmentsRepository = new AppointmentsRepositoryStub();
        const translator = createDefaultTranslator().build();

        const useCase = new ScheduleEmergencyAppointmentUseCaseImpl(
            petRepository,
            veterinariansRepository,
            appointmentsRepository,
            translator
        );

        const result = await useCase.execute({
            date: new Date('2025-01-01T10:00:00Z'),
            notes: 'Emergency session',
            pet_id: defaultPet.id,
            veterinarian_id: defaultVeterinarian.id,
            procedures: [{ id: 'proc-1', description: 'Consult', cost: 100 }]
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toHaveProperty('appointment');
        expect(appointmentsRepository.getAppointments()).toHaveLength(1);
    });
});
