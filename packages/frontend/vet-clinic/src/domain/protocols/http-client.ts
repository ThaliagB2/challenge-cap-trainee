export interface HttpClient {
    request<T>(params: HttpClient.Request): Promise<HttpClient.Response<T>>;
}

export namespace HttpClient {
    export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    export type Request = {
        url: string;
        method: Method;
        body?: unknown;
        headers?: Record<string, string>;
    }

    export type Response<T = unknown> = {
        statusCode: number;
        body: T;
    }
}
