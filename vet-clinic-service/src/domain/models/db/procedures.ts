export type ProceduresProps = {
    id: string;
    description: string;
    cost: number;
};

export class ProceduresModel {
    constructor(private props: ProceduresProps) {}

    public static create(props: ProceduresProps): ProceduresModel {
        return new ProceduresModel(props);
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

    public toObject(): ProceduresProps {
        return {
            id: this.props.id,
            description: this.props.description,
            cost: this.props.cost
        };
    }
}
