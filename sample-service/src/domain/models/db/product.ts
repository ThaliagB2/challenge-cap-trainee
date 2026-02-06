export type ProductProps = {
    id: string;
    name: string;
    price: number;
};

export type FullProductProps = ProductProps & {
    formattedPrice: string;
};

export class ProductModel {
    constructor(private props: ProductProps) {}

    // HINT: static method are created before getters. DO NOT REPLICATE THIS COMMENTARY
    public static basic(props: ProductProps) {
        return new ProductModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get price() {
        return this.props.price;
    }

    public formattedPrice() {
        return this.props.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // HINT: non-static methods are created after getters. DO NOT REPLICATE THIS COMMENTARY
    public toObject(): ProductProps {
        return {
            id: this.props.id,
            name: this.props.name,
            price: this.props.price
        };
    }

    public toFullObject(): FullProductProps {
        return {
            ...this.props,
            formattedPrice: this.formattedPrice()
        };
    }
}
