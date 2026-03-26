import { AppointmentStatus } from '@cds-models/db/types';

import { ProcedureProps } from '@/domain/models/db/procedure';
import { ValidationResult } from '@/domain/validators/common/validation-result';
import { OwnerModel, OwnerProps } from './owner';
import { PetModel, PetProps } from './pet';
import { VeterinarianModel, VeterinarianProps } from './veterinarian';

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

export type OwnerExpenseReportProps = {
    ownerId: string;
    ownerName: string;
    totalExpense: number;
    appointmentCount: number;
    averageCost: number;
    formattedTotalExpense: string;
    formattedAverageCost: string;
};

export type OwnerExpenseReportForCreateProps = Omit<
    OwnerExpenseReportProps,
    'ownerId' | 'ownerName' | 'totalExpense' | 'appointmentCount' | 'averageCost' | 'formattedTotalExpense' | 'formattedAverageCost'
> & {
    ownerId: string;
};

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

export class AppointmentModel {
    constructor(private props: AppointmentProps | OwnerExpenseReportProps | VeterinarianScheduleProps) {}

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

    public static createOwnerExpenseReportDraft(props: OwnerExpenseReportForCreateProps): AppointmentModel {
        return new AppointmentModel({
            ownerId: props.ownerId,
            ownerName: '',
            totalExpense: 0,
            appointmentCount: 0,
            averageCost: 0,
            formattedTotalExpense: '',
            formattedAverageCost: ''
        } as OwnerExpenseReportProps);
    }

    public static createVeterinarianScheduleDraft(): AppointmentModel {
        return new AppointmentModel({
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
        } as VeterinarianScheduleProps);
    }

    public createOwnerExpenseReport(appointments: AppointmentModel[], owner: OwnerModel): AppointmentModel {
        const totalExpense = appointments.reduce((sum, app) => sum + app.totalCost, 0);
        const appointmentCount = appointments.length;
        const averageCost = totalExpense / appointmentCount;
        return new AppointmentModel({
            ownerId: owner.id,
            ownerName: `${owner.firstName} ` + `${owner.lastName}`,
            totalExpense: totalExpense,
            appointmentCount: appointmentCount,
            averageCost: averageCost,
            formattedTotalExpense: this.formatNumberToLocalCurrency(totalExpense),
            formattedAverageCost: this.formatNumberToLocalCurrency(averageCost)
        } as OwnerExpenseReportProps);
    }

    public createVeterianarianSchedule(appointment: FullAppointmentProps, veterinarian: VeterinarianModel, owner: OwnerModel, pet: PetModel): AppointmentModel {
        return new AppointmentModel({
            appointment_id: appointment.id,
            date: appointment.date,
            status: appointment.status,
            isEmergency: appointment.isEmergency,
            totalCost: appointment.formattedTotalCost,
            notes: appointment.notes,
            veterinarian: veterinarian.toCreationObject(),
            owner: owner.toCreationObject(),
            pet: pet.toCreationObject(),
            procedures: appointment.procedures
        } as VeterinarianScheduleProps);
    }

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
    }

    public get id(): string {
        return (this.props as AppointmentProps).id;
    }

    public get date(): Date {
        return (this.props as AppointmentProps).date;
    }

    public get status(): string {
        return (this.props as AppointmentProps).status;
    }

    public get isEmergency(): boolean {
        return (this.props as AppointmentProps).isEmergency;
    }

    public get totalCost(): number {
        return (this.props as AppointmentProps).totalCost;
    }

    public get notes(): string {
        return (this.props as AppointmentProps).notes;
    }

    public get pet_id(): string {
        return (this.props as AppointmentProps).pet_id;
    }

    public get veterinarian_id(): string {
        return (this.props as AppointmentProps).veterinarian_id;
    }

    public get procedures(): ProcedureProps[] {
        return (this.props as AppointmentProps).procedures;
    }

    public toCreationObject(): AppointmentProps {
        return {
            id: (this.props as AppointmentProps).id,
            date: (this.props as AppointmentProps).date,
            status: (this.props as AppointmentProps).status,
            isEmergency: (this.props as AppointmentProps).isEmergency,
            totalCost: (this.props as AppointmentProps).totalCost,
            notes: (this.props as AppointmentProps).notes,
            pet_id: (this.props as AppointmentProps).pet_id,
            veterinarian_id: (this.props as AppointmentProps).veterinarian_id,
            procedures: (this.props as AppointmentProps).procedures
        };
    }

    public toFullObject(): FullAppointmentProps {
        return {
            ...(this.props as AppointmentProps),
            formattedTotalCost: this.formatNumberToLocalCurrency((this.props as AppointmentProps).totalCost)
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

    private formatNumberToLocalCurrency(prop: number) {
        return prop.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}
