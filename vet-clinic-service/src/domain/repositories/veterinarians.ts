import { VeterinariansModel } from '@/domain/models/db/veterinarians';

export interface VeterinariansRepository {
    findVeterinarianById(id: VeterinarianRepository.FindVeterinarianByIdParams): Promise<VeterinarianRepository.FindVeterinarianByIdResult>;
}

export namespace VeterinarianRepository {
    export type FindVeterinarianByIdParams = string;
    export type FindVeterinarianByIdResult = VeterinariansModel | null;
}
