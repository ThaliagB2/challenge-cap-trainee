export type PetProps = {
    id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    weight: number;
    owner_id: string;
};

export class PetModel {
    constructor(private readonly props: PetProps) {}

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

    public get ownerId(): string {
        return this.props.owner_id;
    }

    public get age(): number {
        return PetModel.calculateAge(this.props.birthDate);
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

    private static calculateAge(birthDateValue: string, referenceDate: Date = new Date()): number {
        const birthDate = new Date(birthDateValue);

        let age = referenceDate.getFullYear() - birthDate.getFullYear();

        const birthdayHasNotOccurred =
            referenceDate.getMonth() < birthDate.getMonth() || (referenceDate.getMonth() === birthDate.getMonth() && referenceDate.getDate() < birthDate.getDate());

        if (birthdayHasNotOccurred) {
            age--;
        }

        return age;
    }
}
