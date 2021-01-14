export default interface PartialUser {
    readonly snowflake: bigint;
    readonly username: string;
    readonly birthday: string;
    readonly gender: string;
    readonly summary: string;
    readonly avatar: string;
}
