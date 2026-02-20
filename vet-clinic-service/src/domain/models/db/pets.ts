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

export class PetsModel {
    constructor(private props: PetsProps) {}

    public static create(props: PetsProps) {
        return new PetsModel(props);
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

    public get bread() {
        return this.props.bread;
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
}
