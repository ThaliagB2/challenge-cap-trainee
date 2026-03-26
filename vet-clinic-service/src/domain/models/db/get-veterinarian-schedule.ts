import { AppointmentsProps } from './appointments';
import { OwnersProps } from './owners';
import { ProceduresProps } from './procedures';

export type VeterinarianScheduleProps = {
    id: AppointmentsProps['id'];
    date: AppointmentsProps['date'];
    status: AppointmentsProps['status'];
    isEmergency: AppointmentsProps['isEmergency'];
    totalCost: AppointmentsProps['totalCost'];
    veterinarian_id: AppointmentsProps['veterinarian_id'];
    procedure: ProceduresProps[];
    pet_id: AppointmentsProps['pet_id'];
    owner_id: OwnersProps['id'];
};

export class VeterinarianScheduleModel {
    constructor(private props: VeterinarianScheduleProps) {}

    public static with(props: VeterinarianScheduleProps): VeterinarianScheduleModel {
        return new VeterinarianScheduleModel(props);
    }

    // metodo que gera um array de datas a partir da data atual, com o numero de dias definido no parametros
    public static getDatesArray(days: number): string[] {
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            return date.toISOString();
        });
    }
    // [...schedule] cria uma copia do array e .sort organiza de forma cressente.
    // Esse metodo serve para organizar os agendamentos do veterinario.
    public static orderByDate(schedule: VeterinarianScheduleModel[]): VeterinarianScheduleModel[] {
        return [...schedule].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
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

    public get veterinarian_id(): string {
        return this.props.veterinarian_id;
    }

    public get procedure(): ProceduresProps[] {
        return this.props.procedure;
    }

    public get pet_id(): string {
        return this.props.pet_id;
    }

    public get owner_id(): string {
        return this.props.owner_id;
    }

    public toObject(): VeterinarianScheduleProps {
        return {
            ...this.props
        };
    }
}
