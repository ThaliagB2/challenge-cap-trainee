import { OwnersModel } from '@/domain/models/db/owners';

export interface OwnersRepository {
    findOwnersById(id: OwnerRepository.FindByIParams): Promise<OwnerRepository.FindByIdResult>;
}

export namespace OwnerRepository {
    export type FindByIParams = string;
    export type FindByIdResult = OwnersModel;
}
