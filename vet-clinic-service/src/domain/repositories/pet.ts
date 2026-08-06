import { PetModel } from "../models/db/pet"

export interface PetRepository {
    findById(id: PetRepository.FindByIdParams): Promise <PetRepository.FindByIdResult | null>
    findByOwnerId(onwerId: PetRepository.FindByOwnerIdParams): Promise <PetRepository.FindByOwnerIdResult | null>
}

export namespace PetRepository {
    export type FindByIdParams = string
    export type FindByIdResult = PetModel

    export type FindByOwnerIdParams = string
    export type FindByOwnerIdResult = PetModel[]
}