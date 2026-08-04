using db.models from '../models';

namespace db.types;

type EmergencyAppointmentResult {
    id : UUID;
        date: DateTime;
        status: Association to one models.AppointmentStatus;
        isEmergency: Boolean default false;
        totalCost: Decimal(12,2);
        notes: String(500);
        pet: Association to one models.Pets;
        procedures: Composition of many models.Procedures;
        veterinarian: Association to one models.Veterinarians;
};

type EmergencyProcedureInput {
    description : String(255);
    cost : Decimal(10, 2);
}

type EmergencyAppointmentParams {
        petId: UUID;
        veterinarianId: UUID;
        notes: String;
        procedure: array of types.EmergencyProcedureInput
}