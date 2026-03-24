import { AppointmentsProps } from './appointments';
import { OwnersProps } from './owners';
import { ProceduresProps } from './procedures';

export type VeterinarianScheduleProps = {
    id: AppointmentsProps['id'];
    date: AppointmentsProps['date'];
    status: AppointmentsProps['status'];
    isEmergency: AppointmentsProps['isEmergency'];
    totalCost: AppointmentsProps['totalCost'];
    veterinarian_id: AppointmentsProps['veterinarian_id'];
    procedure: ProceduresProps[];
    pet_id: AppointmentsProps['pet_id'];
    owner_id: OwnersProps['id'];
};

export class VeterinarianScheduleModel {
    constructor(private props: VeterinarianScheduleProps) {}

    public static with(props: VeterinarianScheduleProps): VeterinarianScheduleModel {
        return new VeterinarianScheduleModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get date(): Date {
        return this.props.date;
    }

    public get status(): string {
        return this.props.status;
    }

    public get isEmergency(): boolean {
        return this.props.isEmergency;
    }

    public get totalCost(): number {
        return this.props.totalCost;
    }

    public get veterinarian_id(): string {
        return this.props.veterinarian_id;
    }

    public get procedure(): ProceduresProps[] {
        return this.props.procedure;
    }

    public get pet_id(): string {
        return this.props.pet_id;
    }

    public get owner_id(): string {
        return this.props.owner_id;
    }

    public toObject(): VeterinarianScheduleProps {
        return {
            ...this.props
        };
    }
}
