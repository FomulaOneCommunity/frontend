import {axiosInstance} from '@/server/AxiosConfig';
import axios, {AxiosError} from 'axios';
import type {
    ApiMessage,
    LoginRequest,
    LoginResponse,
    ApiResult,
} from '@/types/Auth';

// 공통 반환 타입
type Result<T> = { data: T | null; error: AxiosError | null };

// 쿠키를 사용하지 않는 무인증 요청의 기본 옵션 (백엔드 CORS 설정에 맞게 조정)
const NO_CREDENTIALS = {withCredentials: false as const};

// -------- 로그인 --------
export async function login(request: LoginRequest): Promise<Result<LoginResponse>> {
    try {
        const res = await axiosInstance.post<LoginResponse>('/users/login', request, NO_CREDENTIALS);
        return {data: res.data, error: null};
    } catch (err: unknown) {
        return axios.isAxiosError(err)
            ? {data: null, error: err}
            : {data: null, error: new AxiosError('Unknown error')};
    }
}

// -------- 회원가입 --------
// FormData 전송 시 브라우저가 boundary 포함한 Content-Type을 자동 설정하도록
// 헤더를 생략하는 것이 가장 안전합니다. (직접 지정하면 boundary 누락 문제 가능)
// ApiServices.ts (요약)
export async function signup(form: FormData) {
    try {
        const res = await axiosInstance.post('/users/signup', form, {
            withCredentials: true, // 쿠키 미사용이면 false
            // headers 설정 금지: Content-Type 자동설정이 안전
        });
        return {data: res.data, error: null};
    } catch (err) {
        // axios.isAxiosError 로 통일
        return axios.isAxiosError(err)
            ? {data: null, error: err}
            : {data: null, error: new AxiosError('Unexpected error')};
    }
}

// -------- 비밀번호 재설정 요청 --------
export async function requestPasswordReset(
    email: string,
    locale: string
): Promise<ApiResult<{ message?: string }>> {
    try {
        const res = await axiosInstance.post<ApiMessage>(
            '/users/password/reset-request',
            {email},
            {
                ...NO_CREDENTIALS,
                headers: {
                    'Accept-Language': locale,
                    'Content-Type': 'application/json',
                },
            }
        );
        return { data: res.data };
    } catch (err: unknown) {
        let msg = 'Unknown error';

        if ((err as AxiosError)?.response?.data) {
            const data = (err as AxiosError).response?.data as { message?: string };
            msg = data?.message ?? msg;
        } else if (err instanceof Error) {
            msg = err.message;
        }

        return {
            error: { response: { data: { message: msg } } },
        };
    }
}

// -------- 비밀번호 변경 확정 --------
export async function requestPasswordChange(
    token: string,
    newPassword: string,
    locale: string
): Promise<Result<ApiMessage>> {
    try {
        const res = await axiosInstance.post<ApiMessage>(
            '/users/password/reset-confirm',
            {token, newPassword},
            {
                ...NO_CREDENTIALS,
                headers: {
                    'Accept-Language': locale,
                    'Content-Type': 'application/json',
                },
            }
        );
        return {data: res.data, error: null};
    } catch (err: unknown) {
        return axios.isAxiosError(err)
            ? {data: null, error: err}
            : {data: null, error: new AxiosError('Unknown error')};
    }
}
