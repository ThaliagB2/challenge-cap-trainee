export type VeterinarianProps = {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    state: string;
    crmv: number;
};

export type VeterinarianWithoutIdProps = Omit<VeterinarianProps, 'id'>;

export type FullVeterinarianProps = VeterinarianProps & {
    formattedCrmv: string;
};

export type SearchVeterinarianScheduleParams = {
    veterinarianId: string;
    days?: number;
};

export class VeterinarianModel {
    constructor(private props: VeterinarianProps) {}

    public static create(props: VeterinarianWithoutIdProps): VeterinarianModel {
        return new VeterinarianModel({
            id: crypto.randomUUID(),
            ...props
        });
    }

    public static with(props: VeterinarianProps): VeterinarianModel {
        return new VeterinarianModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get firstName(): string {
        return this.props.firstName;
    }

    public get description(): string {
        return this.props.lastName;
    }

    public get specialty(): string {
        return this.props.specialty;
    }

    public get state(): string {
        return this.props.state;
    }

    public get crmv(): number {
        return this.props.crmv;
    }

    public formattedCrmv() {
        const specialtyAcronym = this.props.specialty.charAt(0).toUpperCase();
        return `CRMV-${this.props.state} ${this.props.crmv}-${specialtyAcronym}`;
    }

    public toCreationObject(): VeterinarianProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            specialty: this.props.specialty,
            state: this.props.state,
            crmv: this.props.crmv
        };
    }

    public toFullObject(): FullVeterinarianProps {
        return {
            ...this.props,
            formattedCrmv: this.formattedCrmv()
        };
    }
}
