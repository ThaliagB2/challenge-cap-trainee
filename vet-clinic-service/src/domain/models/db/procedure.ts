export type ProcedureProps = {
    id: string;
    description: string;
    cost: number;
    appointment_id: string;
};

export class ProcedureModel {
    constructor(private readonly props: ProcedureProps) {}

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

    public get appointmentId(): string {
        return this.props.appointment_id;
    }

    public toObject(): ProcedureProps {
        return {
            id: this.props.id,
            description: this.props.description,
            cost: this.props.cost,
            appointment_id: this.props.appointment_id
        };
    }
}
