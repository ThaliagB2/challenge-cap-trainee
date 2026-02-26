import { AbstractError } from '@/domain/errors';

export class BadRequestError extends AbstractError {
    constructor(message: string, stack?: string) {
        super(message, 400, stack);
    }
}
