using { db.models } from '../models';

namespace db.types;

type ParamsVeterinarian: {
    veterinarianId: models.Veterinarians:id;
    days: Integer;
}


type VeterinarianSchedule: {
    appointmentId: models.Appointments:id;
    date: models.Appointments:date;
    isEmergency: models.Appointments:isEmergency;
    notes: models.Appointments:notes;
    pet: {
        petId: models.Pets:id;
        name: models.Pets:name;
        species: models.Pets:species;
        breed: models.Pets:breed;
        birthDate: models.Pets:birthDate;
        weight: models.Pets:weight;
    };
    owner: {
        ownerId: models.Owners:id;
        firstName: models.Owners:firstName;
        lastName: models.Owners:lastName;
        phone: models.Owners:phone;
        email: models.Owners:email;
    };
}