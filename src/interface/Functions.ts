export async function copy(text: string) {
    await navigator.clipboard.writeText(text)
}

export async function copyUrl(path: string) {
    const l = window.location
    const p = path.startsWith('/') ? path : `/${path}`
    const protocol = l.protocol
    const hostname = l.hostname
    const port = l.port != null ? `:${l.port}` : ''

    await navigator.clipboard.writeText(`${protocol}//${hostname}${port}${p}`)
}
