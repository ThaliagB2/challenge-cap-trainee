import { AbstractError } from '@/domain/errors';

export class NotFoundError extends AbstractError {
    constructor(key: string, args?: (number | string)[], stack?: string) {
        super(key, 404, args, stack);
    }
}
