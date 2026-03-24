import { OwnerProps } from './owner';
import { PetProps } from './pet';
import { ProcedureProps } from './procedure';
import { VeterinarianProps } from './veterinarian';

export type VeterinarianScheduleProps = {
    appointment_id: string;
    date: Date;
    status: string;
    isEmergency: boolean;
    totalCost: string;
    notes: string;
    veterinarian: VeterinarianProps;
    pet: PetProps;
    owner: OwnerProps;
    procedures: ProcedureProps[];
};

export class VeterinarianScheduleModel {
    constructor(private props: VeterinarianScheduleProps) {}

    public static with(props: VeterinarianScheduleProps): VeterinarianScheduleModel {
        return new VeterinarianScheduleModel(props);
    }

    public get appointment_id(): string {
        return this.props.appointment_id;
    }

    public get date(): Date {
        return this.props.date;
    }

    public get status(): string {
        return this.props.status;
    }

    public get isEmergency(): string {
        return this.props.appointment_id;
    }

    public get totalCost(): string {
        return this.props.totalCost;
    }

    public get notes(): string {
        return this.props.notes;
    }

    public get veterinarian(): VeterinarianProps {
        return this.props.veterinarian;
    }

    public get pet(): PetProps {
        return this.props.pet;
    }

    public get owner(): OwnerProps {
        return this.props.owner;
    }

    public get procedures(): ProcedureProps[] {
        return this.props.procedures;
    }

    public toCreationObject(): VeterinarianScheduleProps {
        return { ...this.props };
    }
}
