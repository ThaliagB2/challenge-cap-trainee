export type ProcedureProps = {
    id: string;
    description: string;
    cost: number;
    appointment_id: string;
};

export type ProcedureWithoutIdProps = Omit<ProcedureProps, 'id'>;

export type FullProcedureProps = ProcedureProps & {
    formattedCost: string;
};

export type FullProcedureWithoutAppointment = Omit<FullProcedureProps, 'appointment_id'>;

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

    public get id(): string {
        return this.props.id;
    }

    public get description(): string {
        return this.props.description;
    }

    public get cost(): number {
        return this.props.cost;
    }

    public get appointment(): string {
        return this.props.appointment_id;
    }

    public formattedCost() {
        return this.props.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    public toCreationObject(): ProcedureProps {
        return {
            id: this.props.id,
            description: this.props.description,
            cost: this.props.cost,
            appointment_id: this.props.appointment_id
        };
    }

    public toFullObject(): FullProcedureProps {
        return {
            ...this.props,
            formattedCost: this.formattedCost()
        };
    }

    public toObjectWithoutAppointment(): FullProcedureWithoutAppointment {
        return {
            id: this.props.id,
            description: this.props.description,
            cost: this.props.cost,
            formattedCost: this.formattedCost()
        };
    }
}
