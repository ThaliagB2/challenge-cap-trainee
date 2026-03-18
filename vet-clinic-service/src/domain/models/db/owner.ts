import { PetProps } from './pet';

export type OwnerProps = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    pets: PetProps[];
};

export type OwnerWithoutIdProps = Omit<OwnerProps, 'id'>;

export type OwnerWithoutPetsProps = Omit<OwnerProps, 'pets'>;

export class OwnerModel {
    constructor(private props: OwnerProps) {}

    public static create(props: OwnerWithoutIdProps): OwnerModel {
        return new OwnerModel({
            id: crypto.randomUUID(),
            ...props
        });
    }

    public static with(props: OwnerProps): OwnerModel {
        return new OwnerModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get firstName(): string {
        return this.props.firstName;
    }

    public get lastName(): string {
        return this.props.lastName;
    }

    public get phone(): string {
        return this.props.phone;
    }

    public get email(): string {
        return this.props.email;
    }

    public get pets(): PetProps[] {
        return this.props.pets;
    }

    public toCreationObject(): OwnerProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            phone: this.props.phone,
            email: this.props.email,
            pets: this.props.pets
        };
    }

    public toObjectWithoutPets(): OwnerWithoutPetsProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            phone: this.props.phone,
            email: this.props.email
        };
    }
}
