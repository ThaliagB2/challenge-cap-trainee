import { left, right } from "@sweet-monads/either";

import { NotFoundError, ServerError } from "@/domain/errors";
import { AppointmentModel } from "@/domain/models/db/appointment";
import { OwnerRepository, PetRepository, VeterinarianRepository } from "@/domain/repositories";
import { AppointmentRepository } from "@/domain/repositories/appointments";
import { GetVeterinarianScheduleItemUseCase } from "@/domain/use-cases/functions";

export class GetVeterinarianScheduleItemUseCaseImpl implements GetVeterinarianScheduleItemUseCase {
    constructor(
        private readonly veterinarianRepository: VeterinarianRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly petRepository: PetRepository,
        private readonly ownerRepository: OwnerRepository,
    ){}

    public async execute(params: GetVeterinarianScheduleItemUseCase.GetVeterinarianScheduleItemUseCaseParams): Promise<GetVeterinarianScheduleItemUseCase.GetVeterinarianScheduleItemUseCaseResult> {
        try{

            const veterianarian = await this.veterinarianRepository.findById(params.veterinarian_id)
            if(!veterianarian){
                return left(new NotFoundError('Veterinarian not exist'))
            }

            const start = new Date();
            const end = new Date(Date.now() + params.days * 1000*60*60*24);

            const parameters :AppointmentRepository.FindByVeterinarianAndPeriodParams = {
                veterinarian_id: veterianarian.id,
                start: start,
                end: end,
            }

            const appointments = await this.appointmentRepository.findByVeterinarianAndPeriod(parameters)
            
            if(!appointments||appointments.length == 0){
                return left(new NotFoundError('No appointments found in this period'));
            }

            const VeterinarianScheduleItem = await Promise.all(appointments.map( async (appointment: AppointmentModel) => {
                const pet = await this.petRepository.findById(appointment.pet_id)
                const owner = await this.ownerRepository.findById(pet.owner_id)
                return {
                        ...appointment.toObject(), 
                        pet: pet?.toObject(),
                        owner: owner?.toObject()}
            }))
            return right(VeterinarianScheduleItem)
        }catch(error){
            const errorData = error as Error;
            return left(new ServerError(errorData.stack, errorData.message));
        }
    }
}