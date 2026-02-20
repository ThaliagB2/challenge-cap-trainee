import { left, right } from '@sweet-monads/either';

import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';
import { NotFoundError } from '@/domain/errors';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';
import { AppointmentRepository, VeterinarianRepository } from '@/domain/repositories';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {
        this.veterinarianRepository = veterinarianRepository;
        this.appointmentRepository = appointmentRepository;
    }

    async execute(veterinarianId: string, days: number = 7): Promise<GetVeterinarianScheduleUseCase.Result> {
        const veterinarianExists = await this.validateVeterinarianExists(veterinarianId);

        if (!veterinarianExists) {
            return left(new NotFoundError('Veterinarian not found'));
        }

        const schedulings = await this.appointmentRepository.findByVetIdAndDate(veterinarianId, days);

        return right(schedulings);
    }

    private async validateVeterinarianExists(veterinarianId: string): Promise<VeterinarianModel> {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);
        return veterinarian;
    }
}
