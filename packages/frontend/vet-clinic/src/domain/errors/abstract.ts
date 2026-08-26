export abstract class AbstractError extends Error {
    public abstract readonly code: number;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
