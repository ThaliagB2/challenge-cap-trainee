import { ProceduresProps } from './procedures';

export type appointmentsProps = {
    id: string;
    date: Date;
    status: string;
    isEmergency: boolean;
    totalCoct: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string;
    procedures: ProceduresProps[];
};

export class AppointmentsModel {
    constructor(private props: appointmentsProps) {}

    public static create(props: appointmentsProps) {
        return new AppointmentsModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get date() {
        return this.props.date;
    }

    public get status() {
        return this.props.status;
    }

    public get isEmergency() {
        return this.props.isEmergency;
    }

    public get totalCoct() {
        return this.props.totalCoct;
    }

    public get notes() {
        return this.props.notes;
    }

    public get pet_id() {
        return this.props.pet_id;
    }

    public get veterinarian_id() {
        return this.props.veterinarian_id;
    }

    public get procedures() {
        return this.props.procedures;
    }

    public toObject(): appointmentsProps {
        return {
            id: this.props.id,
            date: this.props.date,
            isEmergency: this.props.isEmergency,
            status: this.props.status,
            totalCoct: this.props.totalCoct,
            notes: this.props.notes,
            pet_id: this.props.pet_id,
            veterinarian_id: this.props.veterinarian_id,
            procedures: this.props.procedures
        };
    }

    // Método para calcular o custo total com base nos procedimentos
    public calculatecust(): number {
        return this.props.procedures.reduce((total, procedure) => total + procedure.cost, 0);
    }
}
