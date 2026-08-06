import { PetModel } from "../models/db/pet"

export interface PetRepository {
    findById(id: PetRepository.FindByIdParams): Promise <PetRepository.FindByIdResult>
    findByOwnerId(onwerId: PetRepository.FindByOwnerIdParams): Promise <PetRepository.FindByOwnerIdResult>
}

export namespace PetRepository {
    export type FindByIdParams = string
    export type FindByIdResult = PetModel | null
    export type FindByOwnerIdParams = string
    export type FindByOwnerIdResult = PetModel[] | null
}