import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';
import { VeterinarianScheduleModel } from '@/domain/models/db/veterinarian-schedule';
import { VeterinarianModel } from '@/domain/models/db/veterinarian';

export type PayloadResult = {
    hasError: boolean;
    errorMessage?: string;
    schedulings?: VeterinarianScheduleModel[];
    veterinarian?: VeterinarianModel;
};

export interface GetVeterinarianScheduleUseCase {
    execute(veterinarianId: string, days: number): Promise<GetVeterinarianScheduleUseCase.Result>;
}

export namespace GetVeterinarianScheduleUseCase {
    export type Result = Either<AbstractError, PayloadResult>;
}
