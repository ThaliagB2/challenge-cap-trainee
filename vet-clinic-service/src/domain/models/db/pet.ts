export type PetProps = {
    id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: Date;
    weight: number;
    owner_id: string
}

export class PetModel {
    constructor(private props: PetProps){}

    public static with(props: PetProps): PetModel {
        return new PetModel(props)
    }

    public get id(): string {
        return this.props.id
    }

    public get name(): string {
        return this.props.name
    }

    public get species(): string {
        return this.props.species
    }

    public get breed(): string {
        return this.props.breed
    }

    public get birthDate(): Date {
        return this.props.birthDate
    }

    public get weight(): number {
        return this.props.weight
    }

    public get owner_id(): string {
        return this.props.owner_id
    }

    public toObject(): PetProps {
        return {
            id: this.props.id,
            name: this.props.name,
            species: this.props.species,
            breed: this.props.breed,
            birthDate: this.props.birthDate,
            weight: this.props.weight,
            owner_id: this.props.owner_id,
        }
    }
}
