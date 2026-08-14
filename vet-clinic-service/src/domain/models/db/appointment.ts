import { randomUUID } from 'crypto';

import { OwnerProps } from '@/domain/models/db/owner';
import { PetProps } from '@/domain/models/db/pet';
import { ProcedureProps } from './procedure';

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id'> &
    Omit<AppointmentProps, 'procedure'> & {
        id?: string;
        procedures: ProcedureProps[];
    };

export type AppointmentProps = {
    id: string;
    date: string;
    status_id: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures?: ProcedureProps[];
};

export type EmergencyAppointmentParams = {
    pet_id: string;
    veterinarian_id: string;
    notes: string;
    procedures: ProcedureProps[];
};

export type ScheduleVeterinarianAppointmentProps = AppointmentProps & {
    pet: PetProps;
    owner: OwnerProps;
};

export class AppointmentModel {
    constructor(private props: AppointmentProps) {}

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
    }

    public static forCreate(props: AppointmentForCreateProps): AppointmentModel {
        const appointmentId = randomUUID();
        return new AppointmentModel({
            ...props,
            id: appointmentId,
            procedures: props.procedures.map((procedure: ProcedureProps) => ({
                ...procedure,
                id: randomUUID()
            })),
            status_id: props.status_id || 'SCHEDULED',
            totalCost: 0
        });
    }

    public static forEmergencyCreate(props: EmergencyAppointmentParams): AppointmentModel {
        const appointmentId = randomUUID();
        return new AppointmentModel({
            ...props,
            id: appointmentId,
            date: new Date().toISOString(),
            isEmergency: true,
            procedures: props.procedures.map((procedure: ProcedureProps) => ({
                ...procedure,
                id: randomUUID(),
                appointment_id: appointmentId
            })),
            status_id: 'IN_PROGRESS',
            totalCost: 0
        });
    }

    public get id(): string {
        return this.props.id;
    }

    public get date(): string {
        return this.props.date;
    }

    public get status_id(): string {
        return this.props.status_id;
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

    public toObject(): AppointmentProps {
        return {
            ...this.props
        };
    }

    public toCreationObject() {
        return {
            ...this.toObject(),
            totalCost: this.totalCostCalculation()
        };
    }

    public toCreationEmergencyObject() {
        return {
            ...this.toObject(),
            totalCost: this.totalCostCalculation() * 1.5
        };
    }

    private totalCostCalculation(): number {
        if (!this.props.procedures) return 0;
        return this.props.procedures.reduce((sum: number, procedure: ProcedureProps) => sum + procedure.cost, 0);
    }
}
