using { managed } from '@sap/cds/common';

using { db.types } from '../types';


namespace db.models;

entity Appointments: managed {
    key id: UUID;
        date: DateTime;
        status: types.AppointmentStatus default 'SCHEDULED';
        isEmergency: Boolean default false;
        totalCost: Decimal(12,2);
        notes: String(500);
        pet: Association to one models.Pets;
        procedures: Composition of many models.Procedures on procedures.appointment = $self;
        veterinarian: Association to one models.Veterinarians;
}