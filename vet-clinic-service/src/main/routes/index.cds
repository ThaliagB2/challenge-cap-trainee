using { db.models } from '../../../../db/models';

@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    // projeto clínica veterinária 
    entity Owners as projection on models.Owners {
        *,
        virtual fullName: String
    };
    entity Pets as projection on models.Pets;
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments as projection on models.Appointments;
    entity Procedures as projection on models.Procedures;
}

