import { ProcedureModel } from "@/domain/models/db/procedure";

export interface ProcedureRepository {
    create(procedure: ProcedureRepository.CreateParams): Promise <ProcedureRepository.CreateResult>
}

export namespace ProcedureRepository {
    export type CreateParams = ProcedureModel
    export type CreateResult = void
}