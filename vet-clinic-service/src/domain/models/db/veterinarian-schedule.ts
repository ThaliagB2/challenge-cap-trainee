import { data } from '@sap/cds';
import { appointmentsProps } from './appointments';
import { ownersProps } from './owners';
import { PetsProps } from './pets';
import { ProceduresProps } from './procedures';

export interface VeterinarianScheduleProps {
    id: appointmentsProps['id'];
    date: appointmentsProps['date'];
    status: appointmentsProps['status'];
    isEmergency: appointmentsProps['isEmergency'];
    totalCost: appointmentsProps['totalCost'];
    veterinarianId: appointmentsProps['veterinarian_id'];
    procedure: ProceduresProps[];
    pet: PetsProps;
    owner: ownersProps;
}

export class VeterinarianScheduleModel {
    constructor(private props: VeterinarianScheduleProps) {}

    public static create(props: VeterinarianScheduleProps): VeterinarianScheduleModel {
        return new VeterinarianScheduleModel(props);
    }

    public get id(): string {
        return this.props.id;
    }

    public get date(): data {
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

    public get veterinarianId(): string {
        return this.props.veterinarianId;
    }

    public get procedure(): ProceduresProps[] {
        return this.props.procedure;
    }

    public get pet(): PetsProps {
        return this.props.pet;
    }

    public get owner(): ownersProps {
        return this.props.owner;
    }

    public toObject(): VeterinarianScheduleProps {
        return {
            ...this.props
        };
    }
}
