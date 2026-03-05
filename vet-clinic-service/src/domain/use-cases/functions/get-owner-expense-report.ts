import { Either } from '@sweet-monads/either';

import { AbstractError } from '@/domain/errors';

export interface getOwnerExpenseReportUsecase {
    execute(ownerId: string): Promise<getOwnerExpenseReportUsecase.Result>;
}

export namespace getOwnerExpenseReportUsecase {
    export type Result = Either<AbstractError, OwnerExpenseReport>;
    export type OwnerExpenseReport = {
        ownerId: string;
        ownerFullName: string;
        ownerEmail: string;
        totalSpent: number;
        totalAppointments: number;
        totalEmergencyAppointments: number;
    };
}
