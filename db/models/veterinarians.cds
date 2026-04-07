using { db.models } from '.';

namespace db.models;

entity Veterinarians {
    key id: UUID;
        firstName: String(50) not null;
        lastName: String(100) not null;
        specialty: String(100);
        crmv: String(20) not null;
        appointments: Association to many models.Appointments on appointments.veterinarian = $self;
}
