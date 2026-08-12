import { left, right } from '@sweet-monads/either';

import { NotFoundError } from '@/domain/errors/not-found';
import { ServerError } from '@/domain/errors/server';
import { AppointmentRepository, OwnerRepository, PetRepository, VeterinarianRepository } from '@/domain/repositories';
import { GetVeterinarianScheduleUseCase } from '@/domain/use-cases/functions/get-veterinarian-schedule';

export class GetVeterinarianScheduleUseCaseImpl implements GetVeterinarianScheduleUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly petRepository: PetRepository,
        private readonly ownerRepository: OwnerRepository
    ) {}

    public async execute(params: GetVeterinarianScheduleUseCase.Params): GetVeterinarianScheduleUseCase.Result {
        try {
            await this.validateVeterinarian(params.veterinarianId);

            const appointments = await this.getAppointments(params);
            if (appointments.length === 0) {
                return left(new NotFoundError('No appointments found'));
            }

            const scheduleItems = await Promise.all(appointments.map((appointment) => this.createScheduleItem(appointment)));

            scheduleItems.sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime());

            return right(scheduleItems);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return left(error);
            }

            const errorData = error as Error;
            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }

    private async validateVeterinarian(veterinarianId: GetVeterinarianScheduleUseCase.ValidateVeterinarianParams): GetVeterinarianScheduleUseCase.ValidateVeterinarianResult {
        const veterinarian = await this.veterinarianRepository.findById(veterinarianId);

        if (!veterinarian) {
            throw new NotFoundError('Veterinarian not found');
        }
    }

    private async getAppointments(params: GetVeterinarianScheduleUseCase.GetAppointmentsParams): GetVeterinarianScheduleUseCase.GetAppointmentsResult {
        const startDate = new Date();
        const endDate = new Date(startDate);

        endDate.setDate(endDate.getDate() + (params.days ?? 7));

        return this.appointmentRepository.findByVeterinarianAndPeriod({
            veterinarianId: params.veterinarianId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
    }

    private async createScheduleItem(appointment: GetVeterinarianScheduleUseCase.CreateScheduleItemParams): GetVeterinarianScheduleUseCase.CreateScheduleItemResult {
        const pet = await this.petRepository.findById(appointment.petId);

        if (!pet) {
            throw new NotFoundError('Pet not found');
        }

        const owner = await this.ownerRepository.findById(pet.ownerId);

        if (!owner) {
            throw new NotFoundError('Owner not found');
        }

        return {
            ...appointment.toObject(),
            pet: {
                ...pet.toObject(),
                owner: owner.toObject()
            }
        };
    }
}
