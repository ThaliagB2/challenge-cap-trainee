import { randomUUID } from 'crypto';

import { ValidationResult } from '@/domain/validators/common/validation-result';

export type PurchaseOrderProps = {
    id: string;
    date: string;
    total: number;
    items: PurchaseOrderItemProps[];
};

export type PurchaseOrderForCreateProps = Omit<PurchaseOrderProps, 'id'> & {
    id?: string;
};

export type PurchaseOrderItemProps = {
    id: string;
    quantity: number;
    price: number;
    purchaseOrder_id: string;
    product_id: string;
};

export class PurchaseOrderModel {
    constructor(private props: PurchaseOrderProps | PurchaseOrderForCreateProps) {}

    public static basic(props: PurchaseOrderProps) {
        return new PurchaseOrderModel(props);
    }

    public static forCreate(props: PurchaseOrderForCreateProps) {
        const purchaseOrderId = randomUUID();
        return new PurchaseOrderModel({
            ...props,
            id: purchaseOrderId,
            items: props.items?.map((item) => ({
                ...item,
                id: randomUUID(),
                purchaseOrder_id: purchaseOrderId
            })),
            total: 0
        });
    }

    public get id() {
        return this.props.id;
    }

    public get date() {
        return this.props.date;
    }

    public get items() {
        return this.props.items;
    }

    public toCreationObject(): PurchaseOrderProps {
        return {
            id: this.props.id,
            date: this.props.date,
            total: this.calculateTotal(),
            items: this.props.items
        };
    }

    public validate(): ValidationResult {
        const errors = [];
        const items = this.validateItems();
        if (items.hasError) {
            errors.push(...items.errorMessages);
        }
        const date = this.validateDate();
        if (date.hasError) {
            errors.push(...date.errorMessages);
        }
        const total = this.validateTotal();
        if (total.hasError) {
            errors.push(...total.errorMessages);
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validateTotal(): ValidationResult {
        if (!this.calculateTotal() || this.calculateTotal() <= 0) {
            return { hasError: true, errorMessages: ['totalMustBeGreaterThanZero'] };
        }
        return { hasError: false };
    }

    private validateItems(): ValidationResult {
        if (!this.props.items || this.props.items.length === 0) {
            return { hasError: true, errorMessages: ['itemsAreRequired'] };
        }
        const errors = [];
        for (const item of this.props.items) {
            if (!item.quantity || item.quantity <= 0) {
                errors.push('quantityIsRequired');
            }
            if (!item.price || item.price <= 0) {
                errors.push('priceIsRequired');
            }
            if (!item.product_id || item.product_id.trim() === '') {
                errors.push('productIsRequired');
            }
            if (!item.purchaseOrder_id || item.purchaseOrder_id.trim() === '') {
                errors.push('purchaseOrderIsRequired');
            }
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validateDate(): ValidationResult {
        if (!this.props.date || this.props.date.trim() === '') {
            return { hasError: true, errorMessages: ['dateIsRequired'] };
        }
        if (this.props.date.length > 10) {
            return { hasError: true, errorMessages: ['dateMustHaveAtMost10Characters'] };
        }
        return { hasError: false };
    }

    private calculateTotal() {
        return this.props.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    }
}
