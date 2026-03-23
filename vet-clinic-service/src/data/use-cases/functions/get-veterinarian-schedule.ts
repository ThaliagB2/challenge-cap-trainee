import { left, right } from '@sweet-monads/either';

import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { AppointmentRepository, VeterinarianRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result> {
        try {
            if (!params.veterinarian_id) {
                return left(new BadRequestError('veterinarianIdIsRequired'));
            }

            const veterinarian = await this.veterinarianRepository.findById({ id: params.veterinarian_id });
            if (!veterinarian) {
                const message = this.translator.translate('noVeterinarianFound');
                return left(new NotFoundError(message));
            }

            const days = !params.days ? 7 : params.days;
            const datesArray = this.getDatesArray(days);

            const vetSchedules = await this.appointmentRepository.findByVeterinarianIdAndDate({ veterinarianId: params.veterinarian_id, dates: datesArray });
            if (!vetSchedules) {
                return left(new NotFoundError(this.translator.translate('veterinarianScheduleNotFound')));
            }

            const vetSchedulesFullObject = vetSchedules.map((vetSchedule) => vetSchedule.toFullObject());
            const sorted = vetSchedulesFullObject.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return right(sorted);
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private getDatesArray(days: number): string[] {
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            return date.toISOString().split('T')[0];
        });
    }
}
