import { randomUUID } from 'crypto';

import { ValidationResult } from '@/domain/validators/common/validation-result';
import { ProcedureProps, ProcedureForCreateProps } from './procedure';

export type AppointmentProps = {
    id: string;
    date: string;
    status: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProcedureProps[];
};

export type EmergencyAppointmentProps = {
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProcedureForCreateProps[];
};

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id'> & {
    id?: string;
};

export class AppointmentModel {
    constructor(private props: AppointmentProps) {}

    public static create(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
    }

    public static createEmergencyAppointment(props: EmergencyAppointmentProps): AppointmentModel {
        const id = randomUUID();

        const proceduresWithIds: ProcedureProps[] = props.procedures.map((procedure) => ({
            ...procedure,
            id: procedure.id ?? randomUUID()
        }));

        const totalCost = proceduresWithIds.reduce((total, procedure) => total + procedure.cost, 0) * 1.5;

        return new AppointmentModel({
            id: id,
            date: new Date().toISOString(),
            ...props,
            procedures: proceduresWithIds,
            isEmergency: true,
            totalCost: totalCost,
            status: 'IN_PROGRESS'
        });
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

    public get pet_id(): string {
        return this.props.pet_id;
    }

    public get veterinarian_id(): string {
        return this.props.veterinarian_id;
    }

    public get procedures(): ProcedureProps[] {
        return this.props.procedures;
    }

    public toObject(): AppointmentProps {
        return { ...this.props, totalCost: this.calculateTotalCost() };
    }

    public calculateTotalCost(): number {
        return this.props.procedures.reduce((total, procedure) => total + procedure.cost, 0);
    }

    public validateData(): ValidationResult {
        const errors = [];

        if (this.pet_id === '') {
            errors.push('petIsRequired');
        }

        if (this.veterinarian_id === '') {
            errors.push('veterinarianIsRequired');
        }

        if (errors.length > 0) {
            return {
                hasError: true,
                errorMessages: errors
            };
        }

        return { hasError: false };
    }
}
