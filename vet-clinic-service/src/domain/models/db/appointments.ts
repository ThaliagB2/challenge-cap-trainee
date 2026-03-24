import { randomUUID } from 'crypto';
import { ProceduresProps } from './procedures';

export type AppointmentsProps = {
    id: string;
    date: Date;
    status: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProceduresProps[];
};

export type EmergencyAppointmentProps = {
    date: Date;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProceduresProps[];
};

export type AppointmentCreateProps = Omit<AppointmentsProps, 'id'> & { id?: string };

export class AppointmentsModel {
    constructor(private props: AppointmentsProps) {}

    public static with(props: AppointmentsProps): AppointmentsModel {
        return new AppointmentsModel(props);
    }

    public static create(props: EmergencyAppointmentProps): AppointmentsModel {
        const id = randomUUID();
        const totalCost = props.procedures.reduce((total, procedure) => total + procedure.cost, 0) * 1.5;
        return new AppointmentsModel({
            ...props,
            id: id,
            totalCost: totalCost
        } as AppointmentsProps);
    }

    public static createEmergency(props: EmergencyAppointmentProps): AppointmentsModel {
        const id = randomUUID();
        const totalCost = props.procedures.reduce((total, procedure) => total + procedure.cost, 0) * 1.5;
        return new AppointmentsModel({
            id,
            date: props.date,
            status: 'IN_PROGRESS',
            isEmergency: true,
            totalCost: totalCost,
            notes: props.notes,
            pet_id: props.pet_id,
            veterinarian_id: props.veterinarian_id,
            procedures: props.procedures
        });
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

    public get notes(): string {
        return this.props.notes;
    }

    public get pet_id(): string {
        return this.props.pet_id;
    }

    public get veterinarian_id(): string {
        return this.props.veterinarian_id;
    }

    public get procedures(): ProceduresProps[] {
        return this.props.procedures;
    }

    public toObject(): AppointmentsProps {
        return {
            id: this.props.id,
            date: this.props.date,
            isEmergency: this.props.isEmergency,
            status: this.props.status,
            totalCost: this.props.totalCost,
            notes: this.props.notes,
            pet_id: this.props.pet_id,
            veterinarian_id: this.props.veterinarian_id,
            procedures: this.props.procedures
        };
    }

    // Método para calcular o custo total com base nos procedimentos
    public calculateCost(): number {
        return this.props.procedures.reduce((total, procedure) => total + procedure.cost, 0);
    }
}
