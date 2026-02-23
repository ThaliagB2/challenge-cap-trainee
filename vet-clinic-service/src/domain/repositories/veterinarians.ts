import { VeterinariansModel } from '@/domain/models/db/veterinarians';

export interface veterinariansRepository {
    findvetById(id: string): Promise<VeterinariansModel>;
}
