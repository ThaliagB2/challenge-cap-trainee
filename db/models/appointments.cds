using { managed } from '@sap/cds/common';

using { db.models } from '.';

namespace db.models;

entity Appointments: managed {
    key id: UUID;
        date: DateTime not null;
        isEmergency: Boolean default false;
        totalCost: Decimal(12,2);
        notes: String(500);
        status: Association to models.AppointmentStatuses not null;
        pet: Association to models.Pets not null;
        veterinarian: Association to models.Veterinarians not null;
        procedures: Composition of many models.Procedures on procedures.appointment = $self;
}
