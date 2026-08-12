import { left, right } from '@sweet-monads/either';

import { NotFoundError } from '@/domain/errors/not-found';
import { ServerError } from '@/domain/errors/server';
import { AppointmentModel } from '@/domain/models/db/appointment';
import { AppointmentRepository, OwnerRepository, PetRepository } from '@/domain/repositories';
import { GetOwnerExpenseReportUseCase } from '@/domain/use-cases/functions/get-owner-expense-report';

export class GetOwnerExpenseReportUseCaseImpl implements GetOwnerExpenseReportUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly petRepository: PetRepository,
        private readonly appointmentRepository: AppointmentRepository
    ) {}

    public async execute(params: GetOwnerExpenseReportUseCase.Params): GetOwnerExpenseReportUseCase.Result {
        try {
            const owner = await this.ownerRepository.findById(params.ownerId);
            if (!owner) {
                return left(new NotFoundError('Owner not found'));
            }

            const pets = await this.petRepository.findByOwnerId(params.ownerId);
            const appointments = await this.getCompletedAppointments(pets.map((pet) => pet.id));

            if (appointments.length === 0) {
                return left(new NotFoundError('No completed appointments found'));
            }

            const totalExpenses = appointments.reduce((total, appointment) => total + appointment.totalCost, 0);
            const appointmentCount = appointments.length;
            const averageCost = totalExpenses / appointmentCount;

            return right({
                ownerId: owner.id,
                ownerName: owner.fullName,
                totalExpenses,
                appointmentCount,
                averageCost
            });
        } catch (error) {
            const errorData = error as Error;
            return left(new ServerError(errorData.stack ?? '', errorData.message));
        }
    }

    private async getCompletedAppointments(petIds: string[]): Promise<AppointmentModel[]> {
        if (petIds.length === 0) {
            return [];
        }

        const appointments = await this.appointmentRepository.findByPetIds(petIds);

        return appointments.filter((appointment) => appointment.statusId === 'COMPLETED');
    }
}
