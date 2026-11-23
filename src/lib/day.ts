const TZ = "Europe/Athens";

function isValidDay(value: unknown): value is string {
    return (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime())
    );
}

export function resolveDay(date: unknown): string {
    if (isValidDay(date)) return date;
    return new Date().toLocaleDateString("sv-SE", { timeZone: TZ });
}