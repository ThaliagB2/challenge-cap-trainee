import { BadRequestError, NotFoundError, ServerError } from '@/domain/errors';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentRepository, VeterinarianRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { Translator } from '@/domain/utils/translator';
import { ValidationResult } from '@/domain/validators/common/validation-result';
import { left, right } from '@sweet-monads/either';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly translator: Translator
    ) {}

    public async execute(params: GetVeterinarianScheduleUseCase.Params): Promise<GetVeterinarianScheduleUseCase.Result> {
        try {
            // Validate and find Veterinarian
            if (!params.veterinarianId) return left(new BadRequestError('veterinarianIdIsRequired'));
            const checkVetValidity = await this.validateVeterinarian(params.veterinarianId);
            if (checkVetValidity.hasError) {
                const errorMessages = checkVetValidity.errorMessages.map((errorMessage) => this.translator.translate(errorMessage)).join('\n');
                return left(new NotFoundError(errorMessages));
            }
            const veterinarianId = params.veterinarianId;

            let days = 7;
            if (params.days) days = params.days;
            const dateArray = Array.from({ length: days }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return date;
            });

            const vetSchedules = await this.appointmentRepository.findByVeterinarianIdAndDate(veterinarianId, dateArray);
            if (!vetSchedules) return left(new NotFoundError(this.translator.translate('veterinarianScheduleNotFound')));
            const vetSchedulesFullObject = vetSchedules.map((vetSchedule) => vetSchedule.toFullObject());
            return right(vetSchedulesFullObject.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }

    private async getVeterinarian(vetId: string): Promise<VeterinarianModel[]> {
        return this.veterinarianRepository.findById([vetId]);
    }

    private async validateVeterinarian(vetId: string): Promise<ValidationResult> {
        const vet = await this.getVeterinarian(vetId);
        if (!vet) {
            const message = this.translator.translate('noVeterinarianFound');
            return { hasError: true, errorMessages: [message] };
        }
        return { hasError: false };
    }
}
