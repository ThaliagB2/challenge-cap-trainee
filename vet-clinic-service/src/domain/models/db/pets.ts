import { Owner } from '@models/db/models';

export type PetsProps = {
    id: string;
    name: string;
    species: string;
    bread: string;
    birthDate: Date;
    weight: number;
    owner: Owner;
};

export type PetsCreatePropsId = Omit<PetsProps, 'id'> & { id?: string };

export type PetsAgeProps = PetsProps & {
    age: number;
};

export class PetsModel {
    constructor(private props: PetsProps) {}

    public static create(props: PetsProps) {
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

    public get bread(): string {
        return this.props.bread;
    }

    public get birthDate(): Date {
        return this.props.birthDate;
    }

    public get weight(): number {
        return this.props.weight;
    }

    public get owner(): Owner {
        return this.props.owner;
    }

    public toObject(): PetsProps {
        return {
            id: this.props.id,
            name: this.props.name,
            species: this.props.species,
            bread: this.props.bread,
            birthDate: this.props.birthDate,
            weight: this.props.weight,
            owner: this.props.owner
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
