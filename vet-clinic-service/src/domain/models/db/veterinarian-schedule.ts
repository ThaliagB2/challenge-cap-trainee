import { AppointmentProps } from './appointment';
import { OwnerProps } from './owner';
import { PetProps } from './pet';
import { ProcedureProps } from './procedure';

export interface VeterinarianScheduleProps {
    id: AppointmentProps['id'];
    date: AppointmentProps['date'];
    status: AppointmentProps['status'];
    isEmergency: AppointmentProps['isEmergency'];
    totalCost: AppointmentProps['totalCost'];
    notes: AppointmentProps['notes'];
    veterinarian_id: AppointmentProps['veterinarian_id'];
    procedures: ProcedureProps[];
    pet: PetProps;
    owner: OwnerProps;
}

export class VeterinarianScheduleModel {
    constructor(private props: VeterinarianScheduleProps) {}

    public static create(props: VeterinarianScheduleProps): VeterinarianScheduleModel {
        return new VeterinarianScheduleModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get date(): string {
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

    public get notes(): string {
        return this.props.notes;
    }

    public get veterinarian_id(): string {
        return this.props.veterinarian_id;
    }

    public get procedures(): ProcedureProps[] {
        return this.props.procedures;
    }

    public get pet(): PetProps {
        return this.props.pet;
    }

    public get owner(): OwnerProps {
        return this.props.owner;
    }

    public toObject(): VeterinarianScheduleProps {
        return {
            ...this.props
        };
    }
}
