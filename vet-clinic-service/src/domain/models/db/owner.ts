export type OwnerProps = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export class OwnerModel {
    constructor(private props: OwnerProps) {}

    public static with(props: OwnerProps) {
        return new OwnerModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get firstName() {
        return this.props.firstName;
    }

    public get lastName() {
        return this.props.lastName;
    }

    public get phone() {
        return this.props.phone;
    }

    public get email() {
        return this.props.email;
    }

    public toObject(): OwnerProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            phone: this.props.phone,
            email: this.props.email,
        }
    }
}