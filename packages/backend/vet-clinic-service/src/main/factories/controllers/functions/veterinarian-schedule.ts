import { getVeterinarianScheduleItemUseCase } from '@/main/factories/use-cases/functions/veterinarian-schedule';
import { GetVeterinarianScheduleItemController } from '@/presentation/functions';
import { translator } from '../../utils/translator';

const makeGetVeterinarianScheduleItemController = (): GetVeterinarianScheduleItemController => {
    return new GetVeterinarianScheduleItemController(getVeterinarianScheduleItemUseCase, translator);
};

export const getVeterinarianScheduleItemController = makeGetVeterinarianScheduleItemController();
