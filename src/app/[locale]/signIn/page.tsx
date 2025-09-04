'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {
    useState,
    FormEvent,
    KeyboardEventHandler,
    KeyboardEvent,
} from 'react';
import {login} from '@/service/ApiServices';
import auth from '@/hooks/useAuth';
import {useRouter} from 'next/navigation';
import Warning from '@/components/modal/Warning';
import {User} from '@/types/Auth';
import PasswordRules from '@/auth/PasswordRules';
import ForgotPasswordModal from '@/components/modal/ForgotPasswordModal';
import {extractError} from '@/utils/errorExtract';

export default function SignIn() {
    const t = useTranslations('signIn');
    const router = useRouter();
    const {login: loginContext} = auth();

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [warnOpen, setWarnOpen] = useState(false);
    const [warnTitle, setWarnTitle] = useState('');
    const [warnDesc, setWarnDesc] = useState('');
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const [prevCaps, setPrevCaps] = useState(false);
    const [prevNum, setPrevNum] = useState(true);

    const persistSession = (
        remember: boolean,
        user: User,
        accessToken: string,
        refreshToken: string
    ) => {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('ACCESS_TOKEN', accessToken);
        storage.setItem('REFRESH_TOKEN', refreshToken);
    };

    const isAdminMissingToken = (user: User, accessToken?: string) =>
        user.role === 'ADMIN' && !accessToken;

    // 서버 message는 UI에 노출하지 않고, 코드→번역키로만 매핑
    const CODE_TO_KEY = {
        INCORRECT_PASSWORD: 'loginErrors.INCORRECT_PASSWORD',
        INVALID_PASSWORD: 'loginErrors.INVALID_PASSWORD',
        USER_NOT_FOUND: 'loginErrors.USER_NOT_FOUND',
        EMAIL_ALREADY_EXISTS: 'loginErrors.EMAIL_ALREADY_EXISTS',
        FILE_SIZE_EXCEEDED: 'loginErrors.FILE_SIZE_EXCEEDED',
    } as const;

    // 항상 번역 JSON에서만 메시지 제공 (로케일 일관성 보장)
    const getLoginErrorMessage = (code?: string, _message?: string) => {
        if (code && (CODE_TO_KEY as Record<string, string>)[code]) {
            return t(CODE_TO_KEY[code as keyof typeof CODE_TO_KEY]);
        }
        return t('loginErrors.genericError');
    };

    const warn = (title: string, desc: string) => {
        setWarnTitle(title);
        setWarnDesc(desc);
        setWarnOpen(true);
    };

    const checkLock = (
        e: KeyboardEvent,
        key: 'CapsLock' | 'NumLock',
        prev: boolean,
        setPrev: (v: boolean) => void,
        title: string,
        desc: string
    ) => {
        const state = 'getModifierState' in e && e.getModifierState(key);
        if (state && !prev) warn(title, desc);
        setPrev(state);
    };

    const handleKeyEvent: KeyboardEventHandler<HTMLInputElement> = (e) => {
        checkLock(
            e,
            'CapsLock',
            prevCaps,
            setPrevCaps,
            t('keyboardWarnings.capsLockOn'),
            t('keyboardWarnings.checkCase')
        );
        checkLock(
            e,
            'NumLock',
            prevNum,
            setPrevNum,
            t('keyboardWarnings.numLockOn'),
            t('keyboardWarnings.numPadActive')
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { data, error } = await login({ loginId: email, password });

        if (error || !data?.user || !data?.accessToken) {
            const getTopLevelError = (v: unknown) => {
                if (!v || typeof v !== 'object') return { code: undefined, message: undefined };
                const o = v as Record<string, unknown>;
                return {
                    code: typeof o.code === 'string' ? o.code : undefined,
                    message: typeof o.message === 'string' ? o.message : undefined,
                };
            };

            const { code, message } = error ? extractError(error) : getTopLevelError(data);

            // 경고 모달 띄우기
            warn(t('warnTitle'), getLoginErrorMessage(code, message));
            return;
        }

        const { user, accessToken, refreshToken } = data;

        if (isAdminMissingToken(user, accessToken)) {
            warn(t('warnTitle'), t('adminTokenRequired'));
            return;
        }

        // 세션 저장 & 컨텍스트 업데이트
        persistSession(rememberMe, user, accessToken, refreshToken);
        loginContext(user, accessToken, refreshToken);

        // 메인 페이지 이동
        router.push('/');
    };

    const validatePassword = (value: string) => {
        setPasswordCriteria({
            length: /^.{8,30}$/.test(value),
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            special: /[!@#%^&+=-]/.test(value),
        });
    };

    return (
        <>
            <div className="flex min-h-screen">
                {/* 왼쪽: 로그인 폼 */}
                <div className="flex w-1/2 flex-col justify-center px-8 py-12 lg:px-20 xl:px-24 bg-white relative">
                    <div
                        className="mx-auto w-full max-w-sm lg:w-96 border border-gray-200 shadow-lg rounded-lg p-6 bg-white">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            {t('title')}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {t('notMember')}{' '}
                            <Link
                                href="/signUp"
                                className="font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                {t('signUpNow')}
                            </Link>
                        </p>

                        {/* 폼 */}
                        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {t('email')}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder={t('email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>

                            {/* 비밀번호 */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {t('password')}
                                </label>

                                <div className="mt-2 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder={t('password')}
                                        value={password}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setPassword(value);
                                            validatePassword(value);
                                        }}
                                        onKeyUp={handleKeyEvent}
                                        autoComplete="current-password"
                                        className="block w-full rounded-md bg-white px-3 py-2 pr-10 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                    />

                                    {/* 오른쪽 아이콘/버튼 */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                                        title={showPassword ? t('hidePassword') : t('showPassword')}
                                        className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            // eye-off
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeWidth="2"
                                                    d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-3.42M9.88 5.09A9.53 9.53 0 0112 5c6 0 9 7 9 7a16.7 16.7 0 01-3.29 4.36M6.11 6.11C4.12 7.47 3 9 3 9s3 7 9 7c1.08 0 2.11-.2 3.06-.56"
                                                />
                                            </svg>
                                        ) : (
                                            // eye
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeWidth="2"
                                                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"
                                                />
                                                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-2">
                                    {/* 항상 표시: 비밀번호 규칙 */}
                                    <PasswordRules criteria={passwordCriteria}/>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="remember-me"
                                    className="flex items-center gap-2 text-sm text-gray-900"
                                >
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    {t('remember')}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                                >
                                    {t('forgot')}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
                            >
                                {t('submit')}
                            </button>
                        </form>
                        <ForgotPasswordModal open={open} onClose={() => setOpen(false)}/>
                    </div>
                </div>

                {/* 오른쪽: 배경 이미지 */}
                <div className="relative w-1/2 hidden lg:block">
                    <Image
                        alt={t('bgAlt')}
                        src="/SignIn_Background.jpg"
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>
            </div>

            <Warning
                open={warnOpen}
                onClose={() => setWarnOpen(false)}
                title={warnTitle}
                description={warnDesc}
            />
        </>
    );
}