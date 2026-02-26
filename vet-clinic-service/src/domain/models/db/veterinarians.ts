export type VeterinariansProps = {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    crmv: string;
};

export class VeterinariansModel {
    constructor(private props: VeterinariansProps) {}

    public static create(props: VeterinariansProps): VeterinariansModel {
        return new VeterinariansModel(props);
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

    public get specialty(): string {
        return this.props.specialty;
    }

    public get crmv(): string {
        return this.props.crmv;
    }

    public toObject(): VeterinariansProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            specialty: this.props.specialty,
            crmv: this.props.crmv
        };
    }
}
