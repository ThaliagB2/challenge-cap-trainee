import { OwnersModel } from '@/domain/models/db/owners';

export interface OwnersRepository {
    findOwnersById(id: OwnersRepository.FindByIParams): Promise<OwnersRepository.FindByIdResult>;
}

export namespace OwnersRepository {
    export type FindByIParams = { id: string };
    export type FindByIdResult = OwnersModel | null;
}
