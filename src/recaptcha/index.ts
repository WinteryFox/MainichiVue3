export interface ReCaptchaRenderOptions {
    readonly sitekey: string;
    readonly theme?: string;
    readonly size?: "compact" | "normal";
    readonly tabindex?: number;
    readonly callback?: (token: string) => void;
    readonly expiredCallback?: () => void;
    readonly errorCallback?: () => void;
}

export interface ReCaptchaInstance {
    ready(callback: () => void): void;

    execute(widget?: string): void;

    render(container: Element | string, options: ReCaptchaRenderOptions): void;

    reset(widget?: string): void;

    getResponse(widget?: string): string;
}
