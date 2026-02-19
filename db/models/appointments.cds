namespace db.models;

using { managed } from '@sap/cds/common';

using { db.models } from '.';
using { db.types.AppointmentStatus } from '../types';

entity Appointments: managed {
    key id: UUID;
        date: DateTime;
        status: AppointmentStatus;
        isEmergency: Boolean;
        totalCost: Decimal(12,2);
        notes: String(500);
        pet: Association to models.Pets;
        veterinarian: Association to models.Veterinarians;
        procedures: Composition of many models.Procedures on procedures.appointment = $self;
}