export type ProceduresProps = {
    id: string;
    description: string;
    cost: number;
};

export class ProduresModel {
    constructor(private props: ProceduresProps) {}

    public static create(props: ProceduresProps) {
        return new ProduresModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get description() {
        return this.props.description;
    }

    public get cost() {
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
