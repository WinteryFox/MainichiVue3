export default interface Error {
    readonly timestamp: Date;
    readonly path: string;
    readonly status: number;
    readonly error: string;
    readonly message: string;
    readonly requestId: string;
    readonly code: number;
}
