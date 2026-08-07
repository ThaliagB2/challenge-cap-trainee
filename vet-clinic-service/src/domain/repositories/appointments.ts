import { AppointmentModel } from "../models/db/appointment"

export interface AppointmentRepository{
    findByPetId(id: AppointmentRepository.FindByPetIdParams): Promise <AppointmentRepository.FindByPetIdResult>
    findByVeterinarianAndPeriod(params: AppointmentRepository.FindByVeterinarianAndPeriodParams): Promise <AppointmentRepository.FindByVeterinarianAndPeriodResult>
    create(appointment: AppointmentRepository.FindByVeterinarianAndPeriodParams): Promise <AppointmentRepository.CreateResult>
}

export namespace AppointmentRepository {
    export type FindByPetIdParams = string
    export type FindByPetIdResult = AppointmentModel|null
    export type FindByVeterinarianAndPeriodParams = {veterinarianId: string; days: number}
    export type FindByVeterinarianAndPeriodResult = AppointmentModel|null
    export type CreateParams = AppointmentModel
    export type CreateResult = null
}