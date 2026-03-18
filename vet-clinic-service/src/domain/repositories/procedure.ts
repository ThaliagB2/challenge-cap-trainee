import { ProcedureModel } from '@/domain/models/db/procedure';

export interface ProcedureRepository {
    findAll(): Promise<ProcedureRepository.FindAllResult>;
    findById(param: ProcedureRepository.FindByIdsParams): Promise<ProcedureRepository.FindByIdResult>;
    bulkCreate(params: ProcedureRepository.BulkCreateParams): Promise<ProcedureRepository.BulkCreateResult>;
}

export namespace ProcedureRepository {
    export type FindByIdsParams = {
        id: string;
    };
    export type BulkCreateParams = {
        procedures: ProcedureModel[];
    };
    export type FindAllResult = ProcedureModel[] | null;
    export type FindByIdResult = ProcedureModel | null;
    export type BulkCreateResult = void;
}
