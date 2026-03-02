import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export interface VeterinarianRepository {
    findById(id: string): Promise<VeterinarianModel>;
}
