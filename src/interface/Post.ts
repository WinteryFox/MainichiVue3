export default interface Post {
    readonly id: string;
    readonly author: string;
    readonly content: string;
    readonly likeCount: number;
    readonly commentCount: number;
}
