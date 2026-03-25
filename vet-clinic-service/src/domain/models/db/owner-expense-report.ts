import { AppointmentModel } from './appointment';
import { OwnerModel } from './owner';

export type OwnerExpenseReportProps = {
    ownerId: string;
    ownerName: string;
    totalExpense: number;
    appointmentCount: number;
    averageCost: number;
};

export type FullOwnerExpenseReportProps = OwnerExpenseReportProps & {
    formattedTotalExpense: string;
    formattedAverageCost: string;
};

export type OwnerExpenseReportForCreateProps = Omit<OwnerExpenseReportProps, 'ownerId' | 'ownerName' | 'totalExpense' | 'appointmentCount' | 'averageCost'> & {
    ownerId: string;
};

export class OwnerExpenseReportModel {
    constructor(private props: OwnerExpenseReportProps) {}

    public static create(props: OwnerExpenseReportForCreateProps): OwnerExpenseReportModel {
        return new OwnerExpenseReportModel({
            ownerId: props.ownerId,
            ownerName: '',
            totalExpense: 0,
            appointmentCount: 0,
            averageCost: 0
        });
    }

    public static with(props: OwnerExpenseReportProps): OwnerExpenseReportModel {
        return new OwnerExpenseReportModel(props);
    }

    public get ownerId(): string {
        return this.props.ownerId;
    }

    public get ownerFullName(): string {
        return this.props.ownerName;
    }

    public get totalExpense(): number {
        return this.props.totalExpense;
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

    public toFullObject(): FullOwnerExpenseReportProps {
        return {
            ...this.props,
            formattedTotalExpense: this.toFormatTotalExpense(),
            formattedAverageCost: this.toFormatAverageCost()
        };
    }

    public generateOwnerExpenseReport(appointments: AppointmentModel[], owner: OwnerModel): OwnerExpenseReportModel {
        const totalExpense = appointments.reduce((sum, app) => sum + app.totalCost, 0);
        const appointmentCount = appointments.length;
        const averageCost = totalExpense / appointmentCount;
        return OwnerExpenseReportModel.with({
            ownerId: owner.id,
            ownerName: `${owner.firstName} ` + `${owner.lastName}`,
            totalExpense: totalExpense,
            appointmentCount: appointmentCount,
            averageCost: averageCost
        });
    }

    private toFormatTotalExpense(): string {
        return this.props.totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    private toFormatAverageCost(): string {
        return this.props.averageCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}
