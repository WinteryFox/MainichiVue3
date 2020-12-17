export default interface Post {
    readonly snowflake: bigint;
    readonly author: bigint;
    readonly content: string;
}
