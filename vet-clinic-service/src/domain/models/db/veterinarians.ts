export type VeterinariansProps = {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    crmv: string;
};

export class VeterinariansModel {
    constructor(private props: VeterinariansProps) {}

    public static create(props: VeterinariansProps) {
        return new VeterinariansModel(props);
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

    public get specialty() {
        return this.props.specialty;
    }

    public get crmv() {
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
