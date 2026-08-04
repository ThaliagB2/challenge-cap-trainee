using db.models from '../models';

namespace db.types;

type EmergencyAppointmentResult {
    id : UUID;
    date: DateTime;
    status: String(50) enum {
            SCHEDULED;  
            IN_PROGRESS; 
            COMPLETED; 
            CANCELLED
            };
    isEmergency: Boolean;
    totalCost: Decimal(12,2);
    notes: String(500);
    pet: Association to one models.Pets;
    procedures: Composition of many models.Procedures;
    veterinarian: Association to one models.Veterinarians;
}