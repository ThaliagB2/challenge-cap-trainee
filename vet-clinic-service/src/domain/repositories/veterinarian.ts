import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export interface VeterinarianRepository {
    findById(id: VeterinarianRepository.FindByIdParams): Promise<VeterinarianRepository.FindByIdResult>;
}

export namespace VeterinarianRepository {
    export type FindByIdParams = string;
    export type FindByIdResult = VeterinarianModel | null;
}
