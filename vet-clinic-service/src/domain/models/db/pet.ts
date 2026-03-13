import { OwnerWithoutPets } from './owner';

export type PetProps = {
    id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: Date;
    weight: number;
    owner: OwnerWithoutPets;
};

export type PetWithoutIdProps = Omit<PetProps, 'id'>;

export type FullPetProps = PetProps & {
    age: number;
};

export class PetModel {
    constructor(private props: PetProps) {}

    public static create(props: PetWithoutIdProps): PetModel {
        return new PetModel({
            id: crypto.randomUUID(),
            ...props
        });
    }

    public static with(props: PetProps): PetModel {
        return new PetModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get species() {
        return this.props.species;
    }

    public get breed() {
        return this.props.breed;
    }

    public get birthDate() {
        return this.props.birthDate;
    }

    public get weight() {
        return this.props.weight;
    }

    public get owner() {
        return this.props.owner;
    }

    public toCreationObject(): PetProps {
        return {
            id: this.props.id,
            name: this.props.name,
            species: this.props.species,
            breed: this.props.breed,
            birthDate: this.props.birthDate,
            weight: this.props.weight,
            owner: this.props.owner
        };
    }

    public toFullObject(): FullPetProps {
        return {
            ...this.props,
            age: this.getPetAge()
        };
    }

    public getPetAge(): number {
        return Math.floor((new Date().getTime() - this.props.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    }
}
