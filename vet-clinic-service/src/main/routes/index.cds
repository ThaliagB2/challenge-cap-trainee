using { db.models } from '../../../../db/models';

@path: '/vet-clinic'
@requires: 'authenticated-user'
service VetClinicService {
    entity Owners        as projection on models.Owners;
    entity Pets          as projection on models.Pets;
    entity Veterinarians as projection on models.Veterinarians;
    entity Appointments  as projection on models.Appointments;
    entity Procedures    as projection on models.Procedures;
}