import { VeterinarianModel } from '../models/db/veterinarian';

export interface VeterinarianRepository {
    findById(id: string): Promise<VeterinarianModel>;
}
