import { ProcedureProps } from './procedure';

export type AppointmentProps = {
    id: string;
    date: string;
    status_id: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProcedureProps[];
};

export class AppointmentModel {
    constructor(private readonly props: AppointmentProps) {}

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get date(): string {
        return this.props.date;
    }

    public get statusId(): string {
        return this.props.status_id;
    }

    public get isEmergency(): boolean {
        return this.props.isEmergency;
    }

    public get totalCost(): number {
        return this.calculateTotalCost(this.props.procedures);
    }

    public get notes(): string {
        return this.props.notes;
    }

    public get petId(): string {
        return this.props.pet_id;
    }

    public get veterinarianId(): string {
        return this.props.veterinarian_id;
    }

    public get procedures(): ProcedureProps[] {
        return this.props.procedures;
    }

    public toObject(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status_id: this.props.status_id,
            isEmergency: this.props.isEmergency,
            totalCost: this.calculateTotalCost(this.props.procedures),
            notes: this.props.notes,
            pet_id: this.props.pet_id,
            veterinarian_id: this.props.veterinarian_id,
            procedures: this.props.procedures
        };
    }

    private calculateTotalCost(procedures: ProcedureProps[]): number {
        return procedures.reduce((total, procedure) => total + procedure.cost, 0);
    }
}
