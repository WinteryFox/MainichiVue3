export default interface Language {
    readonly code: string;
    readonly language: string;
}

export interface Learning extends Language {
    readonly proficiency: number;
}
