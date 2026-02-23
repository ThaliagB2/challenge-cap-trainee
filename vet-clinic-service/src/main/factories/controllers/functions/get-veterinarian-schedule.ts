import { GetVeterinarianScheduleController } from '@/presentation/functions/get-veterinarian-schedule';
import { makeGetVeterinarianScheduleUseCase } from '../../use-cases/functions/get-veterinarian-schedule';

export const makeGetVeterinarianScheduleController = () => {
    const useCase = makeGetVeterinarianScheduleUseCase();
    return new GetVeterinarianScheduleController(useCase);
};

export const getVeterinarianScheduleController = makeGetVeterinarianScheduleController();
