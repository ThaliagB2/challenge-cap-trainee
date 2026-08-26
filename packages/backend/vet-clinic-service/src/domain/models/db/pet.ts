export type PetProps = {
    id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    weight: number;
    owner_id: string;
};

export type FullPetProps = PetProps & {
    age: number;
};

export class PetModel {
    constructor(private props: PetProps) {}

    public static with(props: PetProps): PetModel {
        return new PetModel(props);
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

    public get birthDate(): string {
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

    public toFullObject(): FullPetProps {
        return {
            ...this.toObject(),
            age: this.ageCalculation()
        };
    }

    private ageCalculation(): number {
        const today = Date.now();
        const birthDate = new Date(this.birthDate).getTime();
        const diffInMs = today - birthDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return Math.floor(diffInDays / 365.25);
    }
}
