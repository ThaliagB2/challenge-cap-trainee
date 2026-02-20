export type ownersProps = {
    id: string;
    fistName: string;
    lastName: string;
    phone: number;
    email: string;
};

export class OwnersModel {
    constructor(private props: ownersProps) {}

    public static create(props: ownersProps) {
        return new OwnersModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get fistName() {
        return this.props.fistName;
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

    public toObject(): ownersProps {
        return {
            id: this.props.id,
            fistName: this.props.fistName,
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
