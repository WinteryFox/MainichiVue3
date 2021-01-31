export function copy(text: string): Promise<void> {
    return navigator.clipboard.writeText(text)
}

export function copyUrl(path: string): Promise<void> {
    return copy(new URL(path, window.location.host).toString())
}
