import { AbstractError } from '@/domain/errors/abstract';

export class ConflictError extends AbstractError {
    constructor(message: string, stack?: string) {
        super(message, 409, stack);
    }
}
