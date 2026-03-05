export type OwnerExpenseReportProps = {
    ownerId: string;
    ownerFullName: string;
    totalExpenses: number;
    appointmentCount: number;
    averageCost: number;
};

export class OwnerExpenseReportModel {
    constructor(private props: OwnerExpenseReportProps) {}

    public static create(props: OwnerExpenseReportProps): OwnerExpenseReportModel {
        return new OwnerExpenseReportModel(props);
    }

    public get ownerId(): string {
        return this.props.ownerId;
    }

    public get ownerFullName(): string {
        return this.props.ownerFullName;
    }

    public get totalExpenses(): number {
        return this.props.totalExpenses;
    }

    public get appointmentCount(): number {
        return this.props.appointmentCount;
    }

    public get averageCost(): number {
        return this.props.averageCost;
    }

    public toObject(): OwnerExpenseReportProps {
        return { ...this.props };
    }
}
