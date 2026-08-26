export type BaseControllerResponse = {
    status: number;
    data?: unknown;
    errorData?: ErrorDetails;
};

export type ErrorDetails = {
    code?: string | number;
    message: string;
    target?: string;
    args?: unknown[];
    status?: number;
};

interface BaseController {
    success(data: unknown): BaseControllerResponse;
    error(code: number, details: ErrorDetails[]): BaseControllerResponse;
}

export class BaseControllerImpl implements BaseController {
    public success(data: unknown): BaseControllerResponse {
        return {
            data,
            status: 200
        };
    }

    public error(code: number, details: ErrorDetails[]): BaseControllerResponse {
        const [detail] = details;
        return {
            status: code,
            errorData: detail ?? { status: code, message: 'Unknown error' }
        };
    }
}
