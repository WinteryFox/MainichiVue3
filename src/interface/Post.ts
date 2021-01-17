export default interface Post {
    readonly id: bigint;
    readonly author: bigint;
    readonly content: string;
    readonly likeCount: number;
    readonly commentCount: number;
}
