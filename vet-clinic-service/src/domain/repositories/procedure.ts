import { ProcedureModel } from '@/domain/models/db/procedure';

export interface ProcedureRepository {
    bulkCreate(params: ProcedureRepository.BulkCreateParams): Promise<ProcedureRepository.BulkCreateResult>;
}

export namespace ProcedureRepository {
    export type BulkCreateParams = {
        procedures: ProcedureModel[];
    };
    export type BulkCreateResult = void;
}
