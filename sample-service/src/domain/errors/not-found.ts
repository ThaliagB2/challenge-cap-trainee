import { AbstractError } from '@/domain/errors';

export class NotFoundError extends AbstractError {
    constructor(message: string, stack?: string) {
        super(message, 404, stack);
    }
}
