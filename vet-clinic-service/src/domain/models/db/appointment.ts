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
    procedures: ProcedureProps[];
    owner: OwnerProps;
    pet: PetProps;
    veterinarian: VeterinarianProps;
};

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id' | 'totalCost'> & {
    id?: string;
};

export type FullAppointmentProps = AppointmentProps & {
    formattedTotalCost: string;
};

export class AppointmentModel {
    constructor(private props: AppointmentProps) {}

    public static create(props: AppointmentForCreateProps): AppointmentModel {
        return new AppointmentModel({
            id: crypto.randomUUID(),
            totalCost: 0,
            ...props
        });
    }

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get date() {
        return this.props.id;
    }

    public get status() {
        return this.props.id;
    }

    public get isEmergency() {
        return this.props.id;
    }

    public get totalCost() {
        return this.props.id;
    }

    public get notes() {
        return this.props.id;
    }

    public get procedures() {
        return this.props.id;
    }

    public get owner() {
        return this.props.id;
    }

    public get pet() {
        return this.props.id;
    }

    public get veterinarian() {
        return this.props.id;
    }

    public formattedTotalCost() {
        return this.props.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    public toCreationObject(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status: this.props.status,
            isEmergency: this.props.isEmergency,
            totalCost: this.calculateTotalCost(),
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

    public calculateTotalCost(): number {
        let totalAmount = 0;
        this.props.procedures.forEach((procedure) => {
            totalAmount += procedure.cost;
        });
        return totalAmount;
    }
}
