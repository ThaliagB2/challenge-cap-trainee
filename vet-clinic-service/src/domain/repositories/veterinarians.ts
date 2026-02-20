import { VeterinariansModel } from '../models/db/veterinarians';

export interface veterinariansRepository {
    findvetById(id: string): Promise<VeterinariansModel>;
}
