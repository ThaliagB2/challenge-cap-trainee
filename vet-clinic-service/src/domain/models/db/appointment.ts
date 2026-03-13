import { ValidationResult } from '@/domain/validators/common/validation-result';
import { AppointmentStatus } from '@models/db/models';
import { OwnerProps } from './owner';
import { PetProps } from './pet';
import { ProcedureProps } from './procedure';
import { VeterinarianProps } from './veterinarian';

export type AppointmentProps = {
    id: string;
    date: Date;
    status: string;
    isEmergency: boolean;
    totalCost: number;
    notes: string;
    owner: OwnerProps;
    pet: PetProps;
    veterinarian: VeterinarianProps;
    procedures: ProcedureProps[];
};

export type AppointmentForCreateProps = Omit<AppointmentProps, 'id' | 'totalCost'> & {
    id?: string;
};

export type FullAppointmentProps = AppointmentProps & {
    formattedTotalCost: string;
};

export type OwnerExpenseReport = {
    ownerId: string;
    ownerName: string;
    totalExpense: number;
    appointmentCount: number;
    averageCost: number;
};

export class AppointmentModel {
    constructor(private props: AppointmentProps) {}

    public static create(props: AppointmentForCreateProps): AppointmentModel {
        return new AppointmentModel({
            id: crypto.randomUUID(),
            totalCost: 0,
            ...props
        });
    }

    public static with(props: AppointmentProps): AppointmentModel {
        return new AppointmentModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get date() {
        return this.props.date;
    }

    public get status() {
        return this.props.status;
    }

    public get isEmergency() {
        return this.props.isEmergency;
    }

    public get totalCost() {
        return this.props.totalCost;
    }

    public get notes() {
        return this.props.notes;
    }

    public get procedures() {
        return this.props.procedures;
    }

    public get owner() {
        return this.props.owner;
    }

    public get pet() {
        return this.props.pet;
    }

    public get veterinarian() {
        return this.props.veterinarian;
    }

    public toCreationObject(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status: this.injectStatus(),
            isEmergency: this.props.isEmergency,
            totalCost: this.calculateTotalCost(),
            notes: this.props.notes,
            procedures: this.props.procedures,
            owner: this.props.owner,
            pet: this.props.pet,
            veterinarian: this.props.veterinarian
        };
    }

    public toCreationObjectForEmergencyAppointment(): AppointmentProps {
        return {
            id: this.props.id,
            date: this.props.date,
            status: AppointmentStatus.IN_PROGRESS,
            isEmergency: true,
            totalCost: this.calculateTotalCostWithEmergencyTax(),
            notes: this.props.notes,
            procedures: this.props.procedures,
            owner: this.props.owner,
            pet: this.props.pet,
            veterinarian: this.props.veterinarian
        };
    }

    public toFullObject(): FullAppointmentProps {
        return {
            ...this.props,
            formattedTotalCost: this.formattedTotalCost()
        };
    }

    private formattedTotalCost() {
        return this.props.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    private calculateTotalCost(): number {
        let totalAmount = 0;
        this.props.procedures.forEach((procedure) => {
            totalAmount += procedure.cost;
        });
        return totalAmount;
    }

    private calculateTotalCostWithEmergencyTax(): number {
        return this.calculateTotalCost() * 1.5;
    }

    private injectStatus(): string {
        if (!this.props.status) return AppointmentStatus.SCHEDULED;
        else return this.props.status;
    }

    public validate(): ValidationResult {
        const errors = [];

        // Validar owner
        const owner = this.validateOwner();
        if (owner.hasError) errors.push(...owner.errorMessages);

        // Validar pet
        const pet = this.validatePet();
        if (pet.hasError) errors.push(...pet.errorMessages);

        // Validar veterinarian
        const veterinarian = this.validateVeterinarian();
        if (veterinarian.hasError) errors.push(...veterinarian.errorMessages);

        // Validar procedures
        const procedures = this.validateProcedures();
        if (procedures.hasError) errors.push(...procedures.errorMessages);

        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validateOwner(): ValidationResult {
        const owner = this.props.owner;
        if (!owner) return { hasError: true, errorMessages: ['ownerIsRequired'] };
        const errors = [];
        if (!owner.id || owner.id.trim() === '') errors.push('ownerIdIsRequired');
        if (!owner.firstName || owner.firstName.trim() === '') errors.push('ownerFirstNameIsRequired');
        if (!owner.lastName || owner.lastName.trim() === '') errors.push('ownerLastNameIsRequired');
        if (!owner.email || owner.email.trim() === '') errors.push('ownerEmailIsRequired');
        if (!owner.phone || owner.phone.trim() === '') errors.push('ownerPhoneIsRequired');
        if (!owner.pets || owner.pets.length === 0) errors.push('ownerPetsAreRequired');
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validatePet(): ValidationResult {
        const pet = this.props.pet;
        if (!pet) return { hasError: true, errorMessages: ['petIsRequired'] };
        const errors = [];
        if (!pet.id || pet.id.trim() === '') errors.push('petIdIsRequired');
        if (!pet.name || pet.name.trim() === '') errors.push('petNameIsRequired');
        if (!pet.species || pet.species.trim() === '') errors.push('petSpeciesIsRequired');
        if (!pet.breed || pet.breed.trim() === '') errors.push('petBreedIsRequired');
        if (!pet.weight) errors.push('petWeightIsRequired');
        if (pet.weight <= 0) errors.push('validPetWeightIsRequired');
        if (!pet.birthDate) errors.push('petBirthDateIsRequired');
        if (pet.birthDate > new Date()) errors.push('validPetBirthDateIsRequired');
        if (!pet.owner) errors.push('petOwnerIsRequired');
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validateVeterinarian(): ValidationResult {
        const vet = this.props.veterinarian;
        if (!vet) return { hasError: true, errorMessages: ['veterinarianIsRequired'] };
        const errors = [];
        if (!vet.id || vet.id.trim() === '') errors.push('veterinarianIdIsRequired');
        if (!vet.firstName || vet.firstName.trim() === '') errors.push('veterinarianFirstNameIsRequired');
        if (!vet.lastName || vet.lastName.trim() === '') errors.push('veterinarianLastNameIsRequired');
        if (!vet.crmv) errors.push('veterinarianCRMVIsRequired');
        if (vet.crmv <= 0) errors.push('validVeterinarianCRMVIsRequired');
        if (!vet.state || vet.state.trim() === '') errors.push('veterinarianStateIsRequired');
        if (!vet.specialty || vet.specialty.trim() === '') errors.push('veterinarianSpecialtyIsRequired');
        return { hasError: errors.length > 0, errorMessages: errors };
    }

    private validateProcedures(): ValidationResult {
        const procedures = this.props.procedures;
        if (!procedures || procedures.length === 0) return { hasError: true, errorMessages: ['proceduresAreRequired'] };
        const errors = [];
        for (const proc of procedures) {
            if (!proc.id || proc.id.trim() === '') errors.push('procedureIdIsRequired');
            if (!proc.name || proc.name.trim() === '') errors.push('procedureNameIsRequired');
            if (!proc.description || proc.description.trim() === '') errors.push('procedureDescriptionIsRequired');
            if (!proc.cost) errors.push('procedureIdIsRequired');
            if (proc.cost <= 0) errors.push('validProcedureCostIsRequired');
            if (!proc.appointment) errors.push('procedureAppointmentIsRequired');
        }
        return { hasError: errors.length > 0, errorMessages: errors };
    }
}
