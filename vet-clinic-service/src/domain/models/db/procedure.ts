export type ProcedureProps = {
    id: string;
    description: string;
    cost: number;
};

export type ProcedureForCreateProps = Omit<ProcedureProps, 'id'> & {
    id?: string;
};

export class ProcedureModel {
    constructor(private props: ProcedureProps) {}

    public static create(props: ProcedureProps): ProcedureModel {
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

    public toObject(): ProcedureProps {
        return {
            ...this.props
        };
    }
}
