export function isRecord(v: unknown): v is Record<string, unknown> {
    return v !== null && typeof v === "object";
}

export function getString(o: Record<string, unknown>, key: string): string | undefined {
    const v = o[key];
    return typeof v === "string" ? v : undefined;
}

export function getFirstString(o: Record<string, unknown>, keys: readonly string[]): string | undefined {
    for (const k of keys) {
        const val = getString(o, k);
        if (val !== undefined) return val;
    }
    return undefined;
}

const CODE_KEYS = ["code", "errorCode", "error_code", "에러코드", "코드"] as const;
const MESSAGE_KEYS = ["message", "errorMessage", "error_message", "메시지", "사유"] as const;

export function extractError(o: unknown) {
    if (!isRecord(o)) {
        return { code: undefined, message: undefined };
    }

    const code = getFirstString(o, CODE_KEYS);
    const message = getFirstString(o, MESSAGE_KEYS);

    return { code, message };
}