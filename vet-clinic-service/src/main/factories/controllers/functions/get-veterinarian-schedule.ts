import { GetVeterinarianSchedule } from '@/presentation/functions/get-veterinarian-schedule';
import { makeGetVeterinarianScheduleUseCase } from '../../use-cases/functions/get-veterinarian-schedule';

export const makeGetVeterinarianScheduleController = () => {
    const useCase = makeGetVeterinarianScheduleUseCase();
    return new GetVeterinarianSchedule(useCase);
};

export const getVeterinarianScheduleController = makeGetVeterinarianScheduleController();
