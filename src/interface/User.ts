export default interface User {
    readonly snowflake: bigint;
    readonly email: string;
    readonly username: string;
    readonly birthday: string;
    readonly gender: symbol;
    readonly summary: string;
    readonly avatar: string;
}
