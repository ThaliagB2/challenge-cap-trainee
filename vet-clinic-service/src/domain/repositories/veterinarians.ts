import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export interface VeterinarianRepository {
    findById(params: VeterinarianRepository.FindByIdParams): Promise<VeterinarianRepository.FindByIdResult>;
}

export namespace VeterinarianRepository {
    export type FindByIdParams = {
        id: string;
    };
    export type FindByIdResult = VeterinarianModel;
}
