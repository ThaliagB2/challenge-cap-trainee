import { AppointmentStatus } from '@cds-models/db/types';

import { ProcedureProps } from '@/domain/models/db/procedure';
import { ValidationResult } from '@/domain/validators/common/validation-result';

export type AppointmentProps = {
    id: string;
    date: Date;
    status: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProcedureProps[];
};

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id' | 'totalCost'> & {
    id?: string;
    totalCost?: number;
};

export type FullAppointmentProps = AppointmentProps & {
    formattedTotalCost: string;
};

export class AppointmentModel {
    constructor(private props: AppointmentProps) {}

    public static create(props: AppointmentForCreateProps): AppointmentModel {
        const id = crypto.randomUUID();
        const totalCost = props.procedures.reduce((sum, proc) => sum + proc.cost, 0);

        return new AppointmentModel({
            ...props,
            id: id,
            totalCost: totalCost,
            procedures: props.procedures?.map((proc) => ({
                ...proc,
                id: crypto.randomUUID(),
                appointment_id: id
            }))
        } as AppointmentProps);
    }

    public static createEmergencyAppointment(props: AppointmentForCreateProps): AppointmentModel {
        const id = crypto.randomUUID();
        const totalCost = parseFloat((props.procedures.reduce((sum, proc) => sum + proc.cost, 0) * 1.5).toFixed(2));

        return new AppointmentModel({
            ...props,
            id: crypto.randomUUID(),
            totalCost: totalCost,
            isEmergency: true,
            status: AppointmentStatus.IN_PROGRESS,
            procedures: props.procedures?.map((proc) => ({
                ...proc,
                id: crypto.randomUUID(),
                appointment_id: id
            }))
        } as AppointmentProps);
    }

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
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

    public get procedures(): ProcedureProps[] {
        return this.props.procedures;
    }

    public toCreationObject(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status: this.props.status,
            isEmergency: this.props.isEmergency,
            totalCost: this.props.totalCost,
            notes: this.props.notes,
            pet_id: this.props.pet_id,
            veterinarian_id: this.props.veterinarian_id,
            procedures: this.props.procedures
        };
    }

    public toFullObject(): FullAppointmentProps {
        return {
            ...this.props,
            formattedTotalCost: this.toFormatTotalCost()
        };
    }

    public validateFields(params: AppointmentForCreateProps): ValidationResult {
        const errors = [];
        if (!params.notes) {
            errors.push('notesAreRequired');
        }
        if (!params.pet_id) {
            errors.push('petIdIsRequired');
        }
        if (!params.veterinarian_id) {
            errors.push('vetIdIsRequired');
        }
        if (!params.procedures || params.procedures.length === 0) {
            errors.push('proceduresAreRequired');
        }

        return { hasError: errors.length > 0, errorMessages: errors };
    }

    public validateProcedures(procedures: ProcedureProps[]): ValidationResult {
        if (!procedures || procedures.length === 0) {
            return { hasError: true, errorMessages: ['proceduresAreRequired'] };
        }

        const errors = [];
        for (const proc of procedures) {
            if (!proc.description || proc.description.trim() === '') {
                errors.push('procedureDescriptionIsRequired');
            }
            if (!proc.cost || proc.cost <= 0) {
                errors.push('validProcedureCostIsRequired');
            }
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private toFormatTotalCost() {
        return this.props.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}
