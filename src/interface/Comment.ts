export default interface Comment {
    readonly id: string;
    readonly post: string;
    readonly commenter: string;
    readonly content: string;
}