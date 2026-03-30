import { PetsModel } from '@/domain/models/db/pets';

export class PetFixture {
    private data: {
        id: string;
        name: string;
        species: string;
        breed: string;
        birthDate: Date;
        weight: number;
        owner_id: string;
    } = {
        id: 'pet-1',
        name: 'Buddy',
        species: 'dog',
        breed: 'Labrador',
        birthDate: new Date('2020-01-01'),
        weight: 12.5,
        owner_id: 'owner-1'
    };

    withId(id: string): this {
        this.data.id = id;
        return this;
    }

    withOwnerId(owner_id: string): this {
        this.data.owner_id = owner_id;
        return this;
    }

    withName(name: string): this {
        this.data.name = name;
        return this;
    }

    build(): PetsModel {
        return { ...this.data } as PetsModel;
    }
}

export const createDefaultPet = (): PetFixture => new PetFixture();
