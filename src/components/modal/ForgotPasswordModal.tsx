'use client';

import { FormEvent, useRef, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslations, useLocale } from 'next-intl';
import { requestPasswordReset } from '@/service/ApiServices';
import { AxiosError } from 'axios';

type ForgotPasswordModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function ForgotPasswordModal(
    { open, onClose }: Readonly<ForgotPasswordModalProps>
) {
    const t = useTranslations('forgot');       // ← "forgot" 네임스페이스 사용
    const locale = useLocale();
    const emailRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const resetState = () => {
        setEmail('');
        setMessage('');
        setSubmitting(false);
        setStatus('idle');
    };

    const closeAndReset = () => {
        resetState();
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        setStatus('idle');

        if (!email) {
            setMessage(t('errorRequired'));
            setStatus('error');
            emailRef.current?.focus();
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage(t('errorInvalid'));
            setStatus('error');
            emailRef.current?.focus();
            return;
        }

        try {
            setSubmitting(true);
            const { data, error } = await requestPasswordReset(email.trim(), locale);

            if (error) {
                const axiosError = error as AxiosError<{ message?: string }>;
                const msg = axiosError.response?.data?.message ?? t('serverError');
                setMessage(msg);
                setStatus('error');
                return;
            }
            setMessage(data?.message ?? t('success'));
            setStatus('success');
        } catch (err) {
            console.error('Password reset request failed:', err);
            setMessage(t('networkError'));
            setStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={closeAndReset}
            className="relative z-50"
            initialFocus={emailRef}
            aria-describedby="forgot-desc"
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/40 transition-opacity
                   data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out
                   data-[leave]:duration-200 data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-sm
                     transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0
                     data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95
                     data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in
                     dark:bg-gray-800 dark:text-white dark:outline dark:-outline-offset-1 dark:outline-white/10"
                >
                    <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            {t('title')}
                        </DialogTitle>
                        <button
                            type="button"
                            onClick={closeAndReset}
                            className="ml-3 inline-flex items-center rounded-md p-1.5 text-gray-500
                         hover:bg-gray-100 hover:text-gray-700
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                         dark:hover:bg-white/10"
                            aria-label={t('close')}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    <p id="forgot-desc" className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {t('emailHelp')}
                    </p>

                    {/* 메시지 영역 */}
                    {message && (
                        <output
                            aria-live="polite"
                            htmlFor="email" /* 입력과 연계 */
                            className={`mt-3 text-sm ${
                                status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {message}
                        </output>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                {t('emailLabel')}
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500
                           dark:bg-gray-900 dark:border-gray-700"
                            />
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={closeAndReset}
                                className="inline-flex flex-1 justify-center rounded-md border border-gray-300 px-3 py-2 text-sm
                           font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200
                           dark:hover:bg-white/10"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                aria-busy={submitting}
                                className="inline-flex flex-1 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm
                           font-semibold text-white hover:bg-indigo-500 disabled:opacity-50
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                           dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                {submitting ? t('submitting') : t('submitButton')}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}