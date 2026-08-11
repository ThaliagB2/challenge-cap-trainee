import { getVeterinarianScheduleItemUseCase } from '@/main/factories/use-cases/functions/veterinarian-schedule';
import { GetVeterinarianScheduleItemController } from '@/presentation/functions';

const makeGetVeterinarianScheduleItemController = (): GetVeterinarianScheduleItemController => {
    return new GetVeterinarianScheduleItemController(getVeterinarianScheduleItemUseCase);
};

export const getVeterinarianScheduleItemController = makeGetVeterinarianScheduleItemController();
