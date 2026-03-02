import { PetProps } from './pet';

export type OwnerProps = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    pets?: PetProps[];
};

export class OwnerModel {
    constructor(private props: OwnerProps) {}

    public static create(props: OwnerProps): OwnerModel {
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

    public toObject(): OwnerProps {
        return {
            ...this.props
        };
    }
}
