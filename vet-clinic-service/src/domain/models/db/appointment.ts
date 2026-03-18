import { AppointmentStatus } from '@cds-models/db/types';
import { OwnerProps } from './owner';
import { PetProps } from './pet';
import { ProcedureProps } from './procedure';
import { VeterinarianProps } from './veterinarian';

export type AppointmentProps = {
    id: string;
    date: Date;
    status: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    owner: OwnerProps;
    pet: PetProps;
    veterinarian: VeterinarianProps;
    procedures: ProcedureProps[];
};

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id' | 'totalCost' | 'owner' | 'pet' | 'veterinarian'> & {
    id?: string;
    owner?: OwnerProps;
    pet?: PetProps;
    veterinarian?: VeterinarianProps;
    owner_id?: string;
    pet_id?: string;
    veterinarian_id?: string;
};

export type FullAppointmentProps = AppointmentProps & {
    formattedTotalCost: string;
};

export type OwnerExpenseReport = {
    ownerId: string;
    ownerName: string;
    totalExpense: number;
    appointmentCount: number;
    averageCost: number;
};

export class AppointmentModel {
    constructor(private props: AppointmentProps) {}

    public static create(props: AppointmentForCreateProps): AppointmentModel {
        return new AppointmentModel({
            id: crypto.randomUUID(),
            totalCost: 0,
            ...props
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

    public get owner(): OwnerProps {
        return this.props.owner;
    }

    public get pet(): PetProps {
        return this.props.pet;
    }

    public get veterinarian(): VeterinarianProps {
        return this.props.veterinarian;
    }

    public get procedures(): ProcedureProps[] {
        return this.props.procedures;
    }

    public toCreationObject(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status: this.injectStatus(),
            isEmergency: this.props.isEmergency,
            totalCost: this.calculateTotalCost(),
            notes: this.props.notes,
            procedures: this.props.procedures,
            owner: this.props.owner,
            pet: this.props.pet,
            veterinarian: this.props.veterinarian
        };
    }

    public toCreationObjectForEmergencyAppointment(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status: AppointmentStatus.IN_PROGRESS,
            isEmergency: true,
            totalCost: this.calculateTotalCostWithEmergencyTax(),
            notes: this.props.notes,
            procedures: this.props.procedures,
            owner: this.props.owner,
            pet: this.props.pet,
            veterinarian: this.props.veterinarian
        };
    }

    public toFullObject(): FullAppointmentProps {
        return {
            ...this.props,
            formattedTotalCost: this.formattedTotalCost()
        };
    }

    private formattedTotalCost() {
        return this.props.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    private calculateTotalCost(): number {
        let totalAmount = 0;
        this.props.procedures.forEach((procedure) => {
            totalAmount += procedure.cost;
        });
        return totalAmount;
    }

    private calculateTotalCostWithEmergencyTax(): number {
        return this.calculateTotalCost() * 1.5;
    }

    private injectStatus(): string {
        return !this.props.status ? AppointmentStatus.SCHEDULED : this.props.status;
    }
}
