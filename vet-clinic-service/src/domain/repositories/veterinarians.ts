import { VeterinariansModel } from '@/domain/models/db/veterinarians';

export interface VeterinariansRepository {
    findVeterinarianById(id: VeterinariansRepository.FindVeterinarianByIdParams): Promise<VeterinariansRepository.FindVeterinarianByIdResult>;
}

export namespace VeterinariansRepository {
    export type FindVeterinarianByIdParams = string;
    export type FindVeterinarianByIdResult = VeterinariansModel | null;
}
