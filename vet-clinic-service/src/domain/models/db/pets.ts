export type PetsProps = {
    id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: Date;
    weight: number;
    owner_id: string;
};

export type PetsCreatePropsId = Omit<PetsProps, 'id'> & { id?: string };

export type PetsAgeProps = PetsProps & {
    age: number;
};

export class PetsModel {
    constructor(private props: PetsProps) {}

    public static create(props: PetsProps): PetsModel {
        return new PetsModel(props);
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

    public toObject(): PetsProps {
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
    // Método para calcular a idade do pet com base na data de nascimento
    public calculatebirthDate(): number {
        const today = new Date();
        const birthPet = new Date();
        let yerPet = today.getFullYear() - birthPet.getFullYear();
        const month = today.getMonth() - birthPet.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthPet.getDate())) {
            yerPet--;
        }
        return yerPet;
    }
}
