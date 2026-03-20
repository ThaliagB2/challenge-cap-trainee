import { VeterinariansModel } from '@/domain/models/db/veterinarians';

export interface veterinariansRepository {
    findVeterinarianById(id: string): Promise<VeterinariansModel | null>;
}
