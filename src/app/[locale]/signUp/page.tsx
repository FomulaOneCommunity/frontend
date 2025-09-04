'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {signup} from '@/service/ApiServices';
import type {SignUpRequest} from '@/types/Auth';
import {useRouter} from "next/navigation";
import {FormEvent, useState, ChangeEvent, KeyboardEventHandler, useRef} from "react";
import Warning from '@/components/modal/Warning';
import Success from "@/components/modal/Success";
import PasswordRules from "@/auth/PasswordRules";
import FavoriteModal from "@/components/modal/FavoriteModal";

export default function SignUp() {
    const t = useTranslations('signUp');
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [warnOpen, setWarnOpen] = useState(false);
    const [warnTitle, setWarnTitle] = useState('');
    const [warnDesc, setWarnDesc] = useState('');
    const [favoriteTeam, setFavoriteTeam] = useState<string>('');
    const [favoriteDriver, setFavoriteDriver] = useState<string>('');

    console.log(favoriteTeam, favoriteDriver);

    // ✅ 성공 모달 상태
    const [successOpen, setSuccessOpen] = useState(false);
    const [successTitle, setSuccessTitle] = useState('');
    const [successDesc, setSuccessDesc] = useState('');

    // ✅ FavoriteModal 상태
    const [favoriteOpen, setFavoriteOpen] = useState(false);

    const prevCapsRef = useRef(false);
    const prevNumRef = useRef(true);

    const handleKeyEvent: KeyboardEventHandler<HTMLFormElement> = (e) => {
        if (!e.getModifierState) return;

        const caps = e.getModifierState('CapsLock');
        const num = e.getModifierState('NumLock');

        if (caps && !prevCapsRef.current) {
            setWarnTitle('Caps Lock이 켜졌습니다');
            setWarnDesc('비밀번호 입력 시 대소문자를 확인하세요.');
            setWarnOpen(true);
        }
        if (num && !prevNumRef.current) {
            setWarnTitle('Num Lock이 켜졌습니다');
            setWarnDesc('숫자 패드 입력이 활성화되었습니다.');
            setWarnOpen(true);
        }
        prevCapsRef.current = caps;
        prevNumRef.current = num;
    };

    const [formData, setFormData] = useState<SignUpRequest>({
        username: '',
        birthDate: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: '',
        profileImage: undefined
    });

    console.log(formData);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value, files} = e.target as HTMLInputElement;
        if (name === 'profileImage' && files) {
            const file = files[0];
            setFormData(prev => ({...prev, profileImage: file}));
            const fileNameSpan = document.getElementById('fileName');
            if (fileNameSpan) fileNameSpan.textContent = file.name;
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    const handleServerError = (error: unknown) => {
        const isObject = (v: unknown): v is Record<string, unknown> =>
            typeof v === 'object' && v !== null;

        type ErrorPayload = { code?: string; message?: string };
        type ErrorWithResponse = { response?: { data?: ErrorPayload } };

        const pickPayload = (err: unknown): ErrorPayload => {
            if (isObject(err) && 'response' in err && isObject((err as ErrorWithResponse).response)) {
                const data = (err as ErrorWithResponse).response?.data;
                if (isObject(data)) {
                    return {
                        code: typeof data.code === 'string' ? data.code : undefined,
                        message: typeof data.message === 'string' ? data.message : undefined,
                    };
                }
            }
            return {};
        };

        const { code, message } = pickPayload(error);

        const messageToKey: Record<string, string> = {
            'The password is invalid.': 'signupErrors.INVALID_PASSWORD',
            'The password format is invalid.': 'signupErrors.INVALID_PASSWORD',
            'User does not exist.': 'signupErrors.USER_NOT_FOUND',
            'This email is already registered.': 'signupErrors.EMAIL_ALREADY_EXISTS',
        };

        const i18nKey =
            (code ? `signupErrors.${code}` : undefined) ??
            messageToKey[message ?? ''];

        const localized =
            i18nKey ? t(i18nKey, { default: message ?? t('signupErrors.genericError') })
                : (message ?? t('signupErrors.genericError'));

        setWarnTitle(t('warnTitle'));
        setWarnDesc(localized);
        setWarnOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFavoriteOpen(true);
    };

    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const validatePassword = (value: string) => {
        setPasswordCriteria({
            length: /^.{8,30}$/.test(value),
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            special: /[!@#%^&+=-]/.test(value),
        });
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setFormData(prev => ({...prev, password: value}));
        validatePassword(value);
    };

    const countryOptions = [
        {value: '', label: t('countryOptions.select')},
        {value: 'KR', label: t('countryOptions.kor')},
        {value: 'USA', label: t('countryOptions.usa')},
    ];

    return (
        <>
            <div className="flex min-h-screen">
                {/* 왼쪽 배경 */}
                <div className="relative w-1/2 hidden lg:block">
                    <Image
                        alt="Background Image for Sign Up"
                        src="/SignUp_Background.jpg"
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>

                {/* 폼 영역 */}
                <div className="flex w-full lg:w-1/2 flex-col justify-start px-8 py-2 lg:px-20 xl:px-24 bg-white relative">
                    <div className="mx-auto w-full max-w-sm lg:w-96 border border-gray-200 shadow-md rounded-lg bg-white p-6">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            {t('title')}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {t('already')}{' '}
                            <Link href="/signIn" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                {t('signIn')}
                            </Link>
                        </p>

                        {/* 폼 */}
                        <form
                            onSubmit={handleSubmit}
                            onKeyDownCapture={handleKeyEvent}
                            onKeyUpCapture={handleKeyEvent}
                            className="mt-2 space-y-4"
                        >
                            {/* Profile Image Upload */}
                            <div>
                                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-900">
                                    {t('profileImage')}
                                </label>

                                <div className="mt-2 flex items-center gap-4">
                                    <label
                                        htmlFor="profileImage"
                                        className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        {t('chooseFile')}
                                    </label>
                                    <span id="fileName" className="text-sm text-gray-500"> {t('noFile')} </span>
                                </div>

                                <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* First / Last name */}
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                                        {t('firstName')}
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        placeholder={t('firstName')}
                                        required
                                        onChange={handleChange}
                                        value={formData.firstName}
                                        className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>

                                <div className="w-1/2">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                                        {t('lastName')}
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        placeholder={t('lastName')}
                                        required
                                        onChange={handleChange}
                                        value={formData.lastName}
                                        className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                                    {t('username')}
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    placeholder={t('username')}
                                    required
                                    onChange={handleChange}
                                    value={formData.username}
                                    className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>

                            {/* DOB */}
                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-900">
                                    {t('dob')}
                                </label>
                                <input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    required
                                    onChange={handleChange}
                                    value={formData.birthDate}
                                    className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-900">
                                    {t('country')}
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    required
                                    onChange={handleChange}
                                    value={formData.country}
                                    className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                >
                                    {countryOptions.map(o => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    {t('email')}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t('email')}
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                    className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    {t('password')}
                                </label>

                                <div className="mt-2 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('password')}
                                        required
                                        onChange={handlePasswordChange}
                                        value={formData.password}
                                        className="block w-full rounded-md bg-white px-3 py-2 pr-10 text-gray-900 shadow-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                                        className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            // eye-off
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeWidth="2"
                                                      d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-3.42M9.88 5.09A9.53 9.53 0 0112 5c6 0 9 7 9 7a16.7 16.7 0 01-3.29 4.36M6.11 6.11C4.12 7.47 3 9 3 9s3 7 9 7c1.08 0 2.11-.2 3.06-.56"/>
                                            </svg>
                                        ) : (
                                            // eye
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/>
                                                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* 비밀번호 조건 안내 */}
                                <PasswordRules criteria={passwordCriteria} />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
                            >
                                {t('submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Warning
                open={warnOpen}
                onClose={() => setWarnOpen(false)}
                title={warnTitle}
                description={warnDesc}
            />

            {/* ✅ FavoriteModal 렌더 */}
            {favoriteOpen && (
                <FavoriteModal
                    open={favoriteOpen}
                    onClose={() => setFavoriteOpen(false)}
                    onSubmit={async (team, driver) => {
                        const form = new FormData();
                        form.append("username", formData.username);
                        form.append("email", formData.email);
                        form.append("password", formData.password);
                        form.append("country", formData.country);
                        form.append("firstName", formData.firstName);
                        form.append("lastName", formData.lastName);
                        form.append("birthDate", formData.birthDate);

                        if (formData.profileImage) {
                            form.append("profileImage", formData.profileImage);
                        }

                        // ✅ Favorite 값 포함
                        form.append("favoriteTeam", team ?? "");
                        form.append("favoriteDriver", driver ?? "");

                        try {
                            const { data, error } = await signup(form);
                            if (data) {
                                setFavoriteOpen(false);
                                setSuccessTitle("회원가입 성공");
                                setSuccessDesc(`${team} 팀의 ${driver} 선수를 선택했습니다 🎉`);
                                setSuccessOpen(true);
                            } else {
                                handleServerError(error);
                            }
                        } catch (error: unknown) {
                            handleServerError(error);
                        }
                    }}
                />
            )}

            {/* Success 모달은 선택 사항 (지금은 FavoriteModal만 사용) */}
            <Success
                open={successOpen}
                onClose={() => {
                    setSuccessOpen(false);
                    router.push('/signIn');  // 로그인 페이지 이동
                }}
                title={successTitle}
                description={successDesc}
            />
        </>
    );
}