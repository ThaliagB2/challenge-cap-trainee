
export type VeterinarianProps = {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    crmv: string;
}

export class VeterinarianModel {
    constructor(private props: VeterinarianProps){}

    public static with(props: VeterinarianProps) {
        return new VeterinarianModel(props);
    }

    public get id(){
        return this.props.id;
    }

    public get firstName(){
       return this.props.firstName;
    }

    public get lastName(){
        return this.props.lastName;
    }

    public get specialty(){
        return this.props.specialty;
    }

    public get crmv(){
        return this.props.crmv;
    }

    public toObject(): VeterinarianProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            specialty: this.props.specialty,
            crmv: this.props.crmv,
        }
    }
}