export type ownersProps = {
    id: string;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
};

export class OwnersModel {
    constructor(private props: ownersProps) {}

    public static create(props: ownersProps): OwnersModel {
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

    public get phone(): number {
        return this.props.phone;
    }

    public get email(): string {
        return this.props.email;
    }

    public toObject(): ownersProps {
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
