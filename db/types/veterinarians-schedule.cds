using { db.models } from '../models';

namespace db.types.VeterinariansSchedule;

type ExpectedResults: {
    appointmentId: models.Appointments:id;
    date: models.Appointments:date;
    notes: models.Appointments:notes;
    isEmergency: models.Appointments:isEmergency;
    pet: {
        petId: models.Pets:id;
        name: models.Pets:name;
        species: models.Pets:species;
        breed: models.Pets:breed;
        birthDate: models.Pets:birthDate;
        weight: models.Pets: weight;
    };
    owner: {
        ownerId: models.Owners:id;
        firstName: models.Owners:firstName;
        lastName: models.Owners:lastName;
        email: models.Owners:email;
        phone: models.Owners:phone;
    };
}