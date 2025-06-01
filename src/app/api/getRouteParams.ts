export function getRouteParam(
    request: Request,
    param: string
): string | undefined {
    const parts = new URL(request.url).pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === param);
    return idx !== -1 && parts.length > idx + 1 ? parts[idx + 1] : undefined;
}
