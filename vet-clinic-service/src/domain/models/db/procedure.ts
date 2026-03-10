import { AppointmentProps } from './appointment';

export type ProcedureProps = {
    id: string;
    name: string;
    description: string;
    cost: number;
    appointment: AppointmentProps;
};

export type ProcedureWithoutIdProps = Omit<ProcedureProps, 'id'>;

export type FullProcedureProps = ProcedureProps & {
    formattedCost: string;
};

export class ProcedureModel {
    constructor(private props: ProcedureProps) {}

    public static create(props: ProcedureWithoutIdProps): ProcedureModel {
        return new ProcedureModel({
            id: crypto.randomUUID(),
            ...props
        });
    }

    public static with(props: ProcedureProps): ProcedureModel {
        return new ProcedureModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get description() {
        return this.props.description;
    }

    public get cost() {
        return this.props.cost;
    }

    public get appointment() {
        return this.props.appointment;
    }

    public formattedCost() {
        return this.props.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    public toObject(): ProcedureProps {
        return {
            id: this.props.id,
            name: this.props.name,
            description: this.props.description,
            cost: this.props.cost,
            appointment: this.props.appointment
        };
    }

    public toFullObject(): FullProcedureProps {
        return {
            ...this.props,
            formattedCost: this.formattedCost()
        };
    }
}
