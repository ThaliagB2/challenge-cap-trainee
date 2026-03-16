import { makeGetVeterinarianScheduleUseCase } from '@/main/factories/use-cases/functions/get-veterinarian-schedule';
import { GetVeterinarianScheduleController } from '@/presentation/functions/get-veterinarian-schedule';

export const makeGetVeterinarianScheduleController = () => {
    const useCase = makeGetVeterinarianScheduleUseCase();
    return new GetVeterinarianScheduleController(useCase);
};

export const getVeterinarianScheduleController = makeGetVeterinarianScheduleController();
