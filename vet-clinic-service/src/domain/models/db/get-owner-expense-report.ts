export type OwnerExpenseReportProps = {
    ownerId: string;
    ownerNameFull: string;
    totalExpenses: number;
    appointmentCount: number;
    averageCost: number;
};

export class OwnerExpenseReport {
    constructor(private props: OwnerExpenseReportProps) {}

    public static create(props: OwnerExpenseReportProps): OwnerExpenseReport {
        return new OwnerExpenseReport(props);
    }

    public static averageCost(totalExpenses: number, appointmentCount: number): number {
        if (appointmentCount === 0) return 0;

        return totalExpenses / appointmentCount;
    }

    public get ownerId(): string {
        return this.props.ownerId;
    }

    public get ownerNameFull(): string {
        return this.props.ownerNameFull;
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
        return {
            ownerId: this.props.ownerId,
            ownerNameFull: this.props.ownerNameFull,
            totalExpenses: this.props.totalExpenses,
            appointmentCount: this.props.appointmentCount,
            averageCost: this.props.averageCost
        };
    }
}
