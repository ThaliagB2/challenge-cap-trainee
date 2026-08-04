using { managed } from '@sap/cds/common';

namespace db.models;

entity Appointments: managed {
    key id: UUID;
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
        procedures: Composition of many models.Procedures on procedures.appointment = $self;
        veterinarian: Association to one models.Veterinarians;
}