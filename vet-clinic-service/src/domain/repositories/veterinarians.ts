import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export interface VeterinarianRepository {
    findAll(): Promise<VeterinarianModel[]>;
    findById(ids: string[]): Promise<VeterinarianModel[]>;
}
