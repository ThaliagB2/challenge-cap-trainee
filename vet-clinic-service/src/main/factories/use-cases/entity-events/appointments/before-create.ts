import { BeforeCreateAppointmentsUseCaseImpl } from '@/data/use-cases/entity-events/appointments/before-create';
import { PetsRepositoryImpl, VeterinariansRepositoryImpl } from '@/infra/db/hana/repositories';
import { makeTranslator } from '@/main/factories/utils/translator';

export const makeBeforeCreateAppointmentUseCase = () => {
    const petRepository = new PetsRepositoryImpl();
    const vetRepository = new VeterinariansRepositoryImpl();
    const translator = makeTranslator();
    return new BeforeCreateAppointmentsUseCaseImpl(petRepository, vetRepository, translator);
};
