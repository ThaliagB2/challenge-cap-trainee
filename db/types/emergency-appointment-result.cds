using db.models from '../models';

namespace db.types;

type EmergencyAppointmentResult {
    id : UUID;
        date: DateTime;
        status: types.AppointmentStatus default 'SCHEDULED';
        isEmergency: Boolean default false;
        totalCost: Decimal(12,2);
        notes: String(500);
        pet: Association to one models.Pets;
        procedures: Composition of many models.Procedures;
        veterinarian: Association to one models.Veterinarians;
}