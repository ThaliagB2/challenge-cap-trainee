import { ScheduleEmergencyAppointmentUseCase } from '@/domain/use-cases/actions/schedule-emergency-appointment';
import { ScheduleEmergencyAppointmentUseCaseImpl } from '@/data/use-cases/actions/schedule-emergency-appointment';
import { PetRepositoryStub, VeterinarianRepositoryStub, AppointmentRepositoryStub, TranslatorStub } from './stubs';

export type SutTypes = {
    petRepository: PetRepositoryStub;
    veterinarianRepository: VeterinarianRepositoryStub;
    appointmentRepository: AppointmentRepositoryStub;
    translator: TranslatorStub;
    sut: ScheduleEmergencyAppointmentUseCase;
};

export const makeSut = (overrides: Partial<Omit<SutTypes, 'sut'>> = {}): SutTypes => {
    const petRepository = overrides.petRepository ?? new PetRepositoryStub();
    const veterinarianRepository = overrides.veterinarianRepository ?? new VeterinarianRepositoryStub();
    const appointmentRepository = overrides.appointmentRepository ?? new AppointmentRepositoryStub();
    const translator = overrides.translator ?? new TranslatorStub();

    const sut = new ScheduleEmergencyAppointmentUseCaseImpl(petRepository, veterinarianRepository, appointmentRepository, translator);

    return {
        petRepository,
        veterinarianRepository,
        appointmentRepository,
        translator,
        sut
    };
};

export const makeValidPayload = (): ScheduleEmergencyAppointmentUseCase.Params => {
    return {
        pet_id: 'valid-pet-id',
        veterinarian_id: 'valid-vet-id',
        notes: 'Emergência - animal ferido',
        procedures: [
            { description: 'Exame clínico geral', cost: 80 },
            { description: 'Aplicação de medicamento', cost: 90 }
        ]
    };
};

export const makePayloadWithSingleProcedure = (): ScheduleEmergencyAppointmentUseCase.Params => {
    return {
        pet_id: 'valid-pet-id',
        veterinarian_id: 'valid-vet-id',
        notes: 'Emergência - fratura',
        procedures: [{ description: 'Cirurgia de emergência', cost: 500 }]
    };
};

