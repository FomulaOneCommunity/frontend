// src/server/AxiosConfig.ts
import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosRequestHeaders,
    InternalAxiosRequestConfig,
} from 'axios';

function asError(e: unknown): Error {
    if (axios.isAxiosError(e)) return e;          // AxiosError 그대로 보존
    if (e instanceof Error) return e;             // 일반 Error 그대로
    try {
        return new Error(JSON.stringify(e));        // 객체 등 문자열화
    } catch {
        return new Error(String(e));                // 최후의 보루
    }
}

// 1) 절대 URL 고정 (환경변수 미설정 대비 기본값)
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://114.204.9.108:10443';
const API_BASE_URL = RAW_BASE.replace(/\/+$/, ''); // 뒤 슬래시 제거
const TIME_OUT = Number(process.env.NEXT_PUBLIC_TIMEOUT) || 10000;

// SSR 안전 가드
const isBrowser = typeof window !== 'undefined';

// 무인증 경로(백엔드 스펙에 맞춰 조정)
const NO_AUTH_PATHS = [
    '/user/login',
    '/user/signin',
    '/user/signup',
    '/user/refresh',
];


// 401에서도 "절대 리프레시 시도/리다이렉트" 하지 않을 경로들
const NO_REFRESH_PATHS = [
    ...NO_AUTH_PATHS,
    '/user/password/reset-request',
    '/user/password/reset-confirm',
];

function toError(reason: unknown): Error {
    if (reason instanceof Error) return reason;
    if (typeof reason === 'string') return new Error(reason);
    try {
        return new Error(JSON.stringify(reason));
    } catch {
        return new Error(String(reason));
    }
}

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL, // 2) 절대 URL만 사용 (i18n 라우트와 분리)
    timeout: TIME_OUT,
    withCredentials: true, // 쿠키 안 쓰면 기본 false로 바꾸세요
});

// -------- Request Interceptor --------
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // ✅ FormData면 Content-Type 삭제 + stringify 방지
        const isFormData =
            typeof FormData !== 'undefined' && config.data instanceof FormData;

        if (isFormData && config.headers) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
            config.transformRequest = [(data) => data];
        }

        // 3) 무인증 경로에서는 Authorization 제거 + withCredentials 끄기(쿠키 미사용 시)
        const url = config.url ?? '';
        const pathOnly = url.startsWith('http') ? new URL(url).pathname : url;
        const isNoAuth = NO_AUTH_PATHS.some((p) => pathOnly.startsWith(p));

        if (isNoAuth) {
            // Authorization 제거 (any 금지)
            delete config.headers?.['Authorization'];

            // prefer nullish coalescing assignment
            config.withCredentials ??= false;
            return config;
        }

        // 토큰 주입 (SSR 보호)
        if (isBrowser) {
            const token =
                localStorage.getItem('ACCESS_TOKEN') || sessionStorage.getItem('ACCESS_TOKEN');
            if (token) {
                // 헤더 객체 보장 + 타입 안전하게 설정
                const headers = (config.headers ?? {});
                headers['Authorization'] = `Bearer ${token}`;
                config.headers = headers;
            }
        }

        return config;
    },
    (error) => Promise.reject(toError(error))
);

// -------- Response Interceptor (401 refresh) --------
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

async function callRefresh(refreshToken: string) {
    // 인스턴스 사용하지 말고 루트 axios로 호출 (무한루프 방지)
    const res = await axios.post(
        `${API_BASE_URL}/user/refresh`,
        { refreshToken },
        { timeout: TIME_OUT }
    );
    return res.data as { accessToken: string };
}

function logoutAndRedirect() {
    if (!isBrowser) return;
    ['ACCESS_TOKEN', 'REFRESH_TOKEN', 'user'].forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
    });
    window.location.href = '/';
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
        const originalRequest = error.config;

        // 원본 요청 경로를 path로 정규화
        const url = originalRequest?.url ?? '';
        const pathOnly = url.startsWith('http') ? new URL(url).pathname : url;

        // ❶ 무인증/인증관리 경로에서 401이 나면, 절대 리프레시/리다이렉트 X → 그대로 에러 전달
        const isNoRefresh = NO_REFRESH_PATHS.some((p) => pathOnly.startsWith(p));
        if (error.response?.status === 401 && isNoRefresh) {
            // AxiosError 그대로 리턴 (toError로 감싸지 마세요)
            return Promise.reject(error);
        }

        // ❷ 그 외 401만 리프레시 시도
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (!isBrowser) {
                return Promise.reject(error); // SSR에서는 시도 안 함
            }

            const refreshToken =
                localStorage.getItem('REFRESH_TOKEN') || sessionStorage.getItem('REFRESH_TOKEN');

            if (!refreshToken) {
                // 로그인/회원가입/비번 관련 경로는 리다이렉트 금지
                if (!isNoRefresh) logoutAndRedirect();
                return Promise.reject(error);
            }
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push((newToken: string) => {
                        const hdrs = (originalRequest.headers ?? {}) as AxiosRequestHeaders;
                        hdrs['Authorization'] = `Bearer ${newToken}`;
                        originalRequest.headers = hdrs;
                        axiosInstance(originalRequest).then(resolve).catch(reject);
                    });
                });
            }

            try {
                isRefreshing = true;
                originalRequest._retry = true;

                const { accessToken } = await callRefresh(refreshToken);

                const storage = localStorage.getItem('REFRESH_TOKEN') ? localStorage : sessionStorage;
                storage.setItem('ACCESS_TOKEN', accessToken);

                pendingRequests.forEach((cb) => cb(accessToken));
                pendingRequests = [];
                isRefreshing = false;

                const hdrs = (originalRequest.headers ?? {}) as AxiosRequestHeaders;
                hdrs['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers = hdrs;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                pendingRequests = [];
                logoutAndRedirect();
                return Promise.reject(asError(refreshError));
            }
        }

        // 나머지 에러는 그대로 전달 (감싸지 않음)
        return Promise.reject(error);
    }
);