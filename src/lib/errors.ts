import type { AxiosError } from 'axios';
export type ApiErrorData = { code?: string; message?: string };

const hasIsAxiosError = (e: unknown): e is { isAxiosError?: boolean } =>
    typeof e === 'object' && e !== null && 'isAxiosError' in e;

function isAxiosError<T = unknown>(e: unknown): e is AxiosError<T> {
    return hasIsAxiosError(e) && e.isAxiosError === true;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

const getStr = (o: Record<string, unknown>, key: string): string | undefined => {
    const v = o[key];
    return typeof v === 'string' ? v : undefined;
};

export const pickErrorInfo = (error: unknown): ApiErrorData => {
    if (!isAxiosError<ApiErrorData>(error)) return {};
    const raw = error.response?.data as unknown;
    if (!isRecord(raw)) return {};

    if ('code' in raw || 'message' in raw) {
        return { code: getStr(raw, 'code'), message: getStr(raw, 'message') };
    }

    const code =
        getStr(raw, 'code') ??
        getStr(raw, 'errorCode') ??
        getStr(raw, 'error_code') ??
        getStr(raw, '에러코드') ??
        getStr(raw, '코드');

    const message =
        getStr(raw, 'message') ??
        getStr(raw, 'errorMessage') ??
        getStr(raw, 'error_message') ??
        getStr(raw, '메시지') ??
        getStr(raw, '사유');

    return { code, message };
};
