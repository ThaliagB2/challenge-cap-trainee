import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export interface VeterinarianRepository {
    findAll(): Promise<VeterinarianRepository.FindAllResult>;
    findById(params: VeterinarianRepository.FindByIdParams): Promise<VeterinarianRepository.FindByIdResult>;
}

export namespace VeterinarianRepository {
    export type FindByIdParams = {
        id: string;
    };
    export type FindAllResult = VeterinarianModel[];
    export type FindByIdResult = VeterinarianModel[];
}
