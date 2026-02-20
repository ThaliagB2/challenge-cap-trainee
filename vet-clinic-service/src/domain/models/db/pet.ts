import { randomUUID } from 'crypto';

export type PetProps = {
    id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: Date;
    weight: number;
    owner_id: string;
};

export type PetForCreateProps = Omit<PetProps, 'id'> & {
    id?: string;
};

export type PetWithAgeProps = PetProps & {
    age: number;
};

export class PetModel {
    constructor(private props: PetProps) {}

    public static create(props: PetProps) {
        return new PetModel(props);
    }
    public static forCreate(props: PetForCreateProps) {
        const id = randomUUID();
        return new PetModel({ ...props, id });
    }

    public get id(): string {
        return this.props.id;
    }

    public get name(): string {
        return this.props.name;
    }

    public get species(): string {
        return this.props.species;
    }

    public get breed(): string {
        return this.props.breed;
    }

    public get birthDate(): Date {
        return this.props.birthDate;
    }

    public get weight(): number {
        return this.props.weight;
    }

    public get owner_id(): string {
        return this.props.owner_id;
    }

    public toObject(): PetProps {
        return {
            id: this.props.id,
            name: this.props.name,
            species: this.props.species,
            breed: this.props.breed,
            birthDate: this.props.birthDate,
            weight: this.props.weight,
            owner_id: this.props.owner_id
        };
    }

    public calculateAge(): number {
        const today = new Date();
        const birthDate = new Date(this.props.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        const hasBirthdayNotPassed = monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate());

        if (hasBirthdayNotPassed) {
            age--;
        }

        return age;
    }
}
