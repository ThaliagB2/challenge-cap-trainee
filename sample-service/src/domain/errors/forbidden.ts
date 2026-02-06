import { AbstractError } from '@/domain/errors/abstract';

export class ForbiddenError extends AbstractError {
    constructor(message: string, stack?: string) {
        super(message, 403, stack);
    }
}
