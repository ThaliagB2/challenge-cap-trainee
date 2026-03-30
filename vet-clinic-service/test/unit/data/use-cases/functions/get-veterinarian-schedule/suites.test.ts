import { GetVeterinarianScheduleUseCaseImpl } from '@/data/use-cases/functions/get-veterinarian-schedule';
import { NotFoundError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/get-veterinarian-schedule';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    createDefaultAppointment,
    createDefaultPet,
    createDefaultVeterinarian
} from '../../../../fixtures';
import { AppointmentsRepositoryStub, PetsRepositoryStub, TranslatorStub, VeterinariansRepositoryStub } from './stubs';

describe('GetVeterinarianScheduleUseCaseImpl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns NotFoundError when veterinarian is not found', async () => {
        const veterinarianRepository = new VeterinariansRepositoryStub();
        const appointmentRepository = new AppointmentsRepositoryStub();
        const petRepository = new PetsRepositoryStub();
        const translator = new TranslatorStub();

        const useCase = new GetVeterinarianScheduleUseCaseImpl(
            veterinarianRepository,
            appointmentRepository,
            petRepository,
            translator
        );

        const result = await useCase.execute({ veterinarianId: 'v1', days: 7 });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('returns NotFoundError when no appointments are found', async () => {
        const veterinarian = createDefaultVeterinarian().build();
        const veterinarianRepository = new VeterinariansRepositoryStub();
        veterinarianRepository.addVeterinarian(veterinarian);
        
        const appointmentRepository = new AppointmentsRepositoryStub();
        const petRepository = new PetsRepositoryStub();
        const translator = new TranslatorStub();

        const useCase = new GetVeterinarianScheduleUseCaseImpl(
            veterinarianRepository,
            appointmentRepository,
            petRepository,
            translator
        );

        const result = await useCase.execute({ veterinarianId: veterinarian.id, days: 7 });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('returns right ordered schedule', async () => {
        const veterinarian = createDefaultVeterinarian().build();
        const veterinarianRepository = new VeterinariansRepositoryStub();
        veterinarianRepository.addVeterinarian(veterinarian);

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayAfter = new Date(now);
        dayAfter.setDate(dayAfter.getDate() + 3);

        const appointmentRepository = new AppointmentsRepositoryStub();
        
        appointmentRepository.addAppointment(
            createDefaultAppointment()
                .withId('a1')
                .withDate(dayAfter)
                .withVeterinarianId(veterinarian.id)
                .withPetId('pet-1')
                .withProcedures([])
                .build()
        );
        appointmentRepository.addAppointment(
            createDefaultAppointment()
                .withId('a2')
                .withDate(tomorrow)
                .withVeterinarianId(veterinarian.id)
                .withPetId('pet-1')
                .withProcedures([])
                .build()
        );

        const pet = createDefaultPet().build();
        const petRepository = new PetsRepositoryStub();
        petRepository.addPet(pet);

        const translator = new TranslatorStub();

        const useCase = new GetVeterinarianScheduleUseCaseImpl(
            veterinarianRepository,
            appointmentRepository,
            petRepository,
            translator
        );

        const result = await useCase.execute({ veterinarianId: veterinarian.id, days: 7 });

        expect(result.isRight()).toBe(true);
        const schedule = result.value as VeterinarianScheduleModel[];
        expect(schedule).toHaveLength(2);
        expect(schedule[0].id).toBe('a2');
    });
});
