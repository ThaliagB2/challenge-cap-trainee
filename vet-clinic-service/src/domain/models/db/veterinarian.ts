export type VeterinarianProps = {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    crmv: string;
};

export class VeterinarianModel {
    constructor(private props: VeterinarianProps) {}

    public static create(props: VeterinarianProps) {
        return new VeterinarianModel(props);
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

    public toObject(): VeterinarianProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            specialty: this.props.specialty,
            crmv: this.props.crmv
        };
    }
}
