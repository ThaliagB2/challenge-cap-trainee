import { OwnerProps } from './owner';
import { PetProps } from './pet';
import { ProcedureProps } from './procedure';
import { VeterinarianProps } from './veterinarian';

// COLOCAR DENTRO DA MODEL DE appointments
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

export type VeterinarianScheduleForCreateProps = Omit<
    VeterinarianScheduleProps,
    'appointment_id' | 'date' | 'status' | 'isEmergency' | 'totalCost' | 'notes' | 'veterinarian' | 'pet' | 'owner' | 'procedures'
> & {
    veterianarian_id: string;
    days?: Date;
};

export class VeterinarianScheduleModel {
    constructor(private props: VeterinarianScheduleProps) {}

    public static createDraft(): VeterinarianScheduleModel {
        return new VeterinarianScheduleModel({
            appointment_id: '',
            date: new Date(),
            status: '',
            isEmergency: false,
            totalCost: '',
            notes: '',
            veterinarian: {} as VeterinarianProps,
            pet: {} as PetProps,
            owner: {} as OwnerProps,
            procedures: []
        });
    }

    public static create(props: VeterinarianScheduleProps): VeterinarianScheduleModel {
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

    public getDatesArray(daysParam?: number): string[] {
        const STANDARD_DAYS = 7;
        const days = !daysParam ? STANDARD_DAYS : daysParam;
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            return date.toISOString().split('T')[0];
        });
    }
}
