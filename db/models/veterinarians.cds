namespace db.models;

using { db.models } from '.';

entity Veterinarians {
    key id: UUID;
        firstName: String(50);
        lastName: String(100);
        specialty: String(100);
        crmv: String(20);
        appointments: Association to many models.Appointments on appointments.veterinarian = $self;
}