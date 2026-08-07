import { randomUUID } from "crypto";

export type ProcedureProps = {
    description: string;
    cost: number
}

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id'> & {
    id?: string;
}

// export type PurchaseOrderForCreateProps = Omit<PurchaseOrderProps, 'id'> & {
//     id?: string;
// };

export type AppointmentProps = {
    id: string;
    date: string;
    status: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    pet_id: string;
    veterinarian_id: string
    procedures: ProcedureProps[]
}

// totalCost = procedures[0].cost + procedures[1].cost + ... + procedures[n].cost

export class AppointmentModel {
    constructor (private props: AppointmentProps) {}

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props)
    }

    public static forCreate(props: AppointmentForCreateProps): AppointmentModel{
        const appointmentId = randomUUID()
        return new AppointmentModel({
            ...props,
            id: appointmentId,
            procedures: props.procedures.map((procedure: ProcedureProps) => ({
                ...procedure,
                id: randomUUID(),
            })),
            totalCost: 0,
        })
    }

    // public static forCreate(props: PurchaseOrderForCreateProps) {
    //     const purchaseOrderId = randomUUID();
    //     return new PurchaseOrderModel({
    //         ...props,
    //         id: purchaseOrderId,
    //         items: props.items?.map((item) => ({
    //             ...item,
    //             id: randomUUID(),
    //             purchaseOrder_id: purchaseOrderId
    //         })),
    //         total: 0
    //     });
    // }

    public get id(): string {
        return this.props.id
    }

    public get date(): string{
        return this.props.date
    }

    public get status(): string{
        return this.props.status
    }

    public get isEmergency(): boolean{
        return this.props.isEmergency
    }

    public get totalCost(): number{
        return this.props.totalCost
    }

    public get notes(): string{
        return this.props.notes
    }

    public get pet_id(): string{
        return this.props.pet_id
    }

    public get veterinarian_id(): string{
        return this.props.veterinarian_id
    }

    public toObject(): AppointmentProps {
        return {
            ...this.props
        }
    }

    public toCreationObject() {
        return {
            ...this.toObject(),
            totalCost: this.totalCostCalculation(),
            procedures: this.props.procedures
        }
    }

    private totalCostCalculation(): number {
        return this.props.procedures.reduce((sum: number, procedure: ProcedureProps) => sum + procedure.cost, 0)
    }

}