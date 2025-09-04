export type LoginRequest = {
    loginId: string;
    password: string;
};

export type LoginResponse = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
};

export type AuthUser = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    profileImageBase64?: string;
};

export interface Auth {
    auth: AuthUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    user?: AuthUser | null;
    login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export interface SignUpRequest {
    username: string;
    birthDate: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    profileImage?: File;
    favoriteTeam?: string;
    favoriteDriver?: string;
}

export type ApiMessage = { message: string };

export interface ApiErrorData {
    code?: string;
    message?: string;
}

export interface ApiError {
    response?: {
        data?: ApiErrorData;
    };
}

export interface User {
    id: number;
    email: string;
    role: string;
}

export type ApiResult<T> = {
    data?: T;          // 성공 시 설정
    error?: ApiError;  // 실패 시 설정 (성공 시 '생략'!)
};

export type SidebarProps = {
    readonly open: boolean;
    readonly onCloseAction: (value: boolean) => void;
};

export interface FavoriteModalProps {
    open: boolean
    onClose: () => void
    onSubmit?: (team: string | null, driver: string | null) => void
}

export interface DropdownProps {
    readonly label: string
    readonly items: readonly string[]  // 배열도 불변으로
    readonly selected: string
    readonly onChange: (value: string) => void
}
