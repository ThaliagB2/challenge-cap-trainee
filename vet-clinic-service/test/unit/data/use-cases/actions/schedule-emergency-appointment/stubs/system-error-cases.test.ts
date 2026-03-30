import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { ServerError } from '@/domain/errors';
import { describe, expect, it, vi } from 'vitest';
import {
    createDefaultPet,
    createDefaultTranslator,
    createDefaultVeterinarian
} from '../../../../../fixtures';
import { AppointmentsRepositoryStub } from './appointments-repository-stub';
import { PetsRepositoryStub } from './pet-repository-stub';
import { VeterinariansRepositoryStub } from './veterinarians-repository-stub';

describe('ScheduleEmergencyAppointmentUseCaseImpl system error cases', () => {
    it('should return ServerError when repository throws', async () => {
        const petRepository = new PetsRepositoryStub();
        petRepository.addPet(createDefaultPet().build());

        const veterinariansRepository = new VeterinariansRepositoryStub();
        veterinariansRepository.addVeterinarian(createDefaultVeterinarian().build());

        const appointmentsRepository = new AppointmentsRepositoryStub();
        vi.spyOn(appointmentsRepository, 'create').mockRejectedValueOnce(new Error('DB failure'));

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
            pet_id: 'pet-1',
            veterinarian_id: 'vet-1',
            procedures: [{ id: 'proc-1', description: 'Consult', cost: 100 }]
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(ServerError);
    });
});
