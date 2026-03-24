export type OwnersProps = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
};

export class OwnersModel {
    constructor(private props: OwnersProps) {}

    public static create(props: OwnersProps): OwnersModel {
        return new OwnersModel(props);
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

    public get fullName(): string {
        return `${this.props.firstName} ${this.props.lastName}`;
    }

    public get phone(): string {
        return this.props.phone;
    }

    public get email(): string {
        return this.props.email;
    }

    public toObject(): OwnersProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            phone: this.props.phone,
            email: this.props.email
        };
    }

    public SetDefaultEmailDomain(): OwnersModel {
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@yahoo.com`;
        }
        return this;
    }
}
