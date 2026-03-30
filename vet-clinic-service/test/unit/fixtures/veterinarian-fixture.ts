import { VeterinariansModel } from '@/domain/models/db/veterinarians';

export class VeterinarianFixture {
    private data = {
        id: 'vet-1',
        firstName: 'Dr. Jane',
        lastName: 'Doe',
        specialty: 'surgery',
        crmv: '12345'
    };

    withId(id: string): this {
        this.data.id = id;
        return this;
    }

    withFirstName(firstName: string): this {
        this.data.firstName = firstName;
        return this;
    }

    withLastName(lastName: string): this {
        this.data.lastName = lastName;
        return this;
    }

    withSpecialty(specialty: string): this {
        this.data.specialty = specialty;
        return this;
    }

    build(): VeterinariansModel {
        return VeterinariansModel.create(this.data);
    }
}

export const createDefaultVeterinarian = (): VeterinarianFixture =>
    new VeterinarianFixture();
