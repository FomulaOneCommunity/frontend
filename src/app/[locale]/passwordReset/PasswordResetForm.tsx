'use client';

import { useState, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { requestPasswordChange } from '@/service/ApiServices';

// Narrow the backend error shape once and reuse it.
type BackendErrorData = { message?: string; error?: string };
type BackendError = { response?: { data?: BackendErrorData } };

function extractBackendMessage(err: unknown): string | null {
    if (err && typeof err === 'object') {
        const be = err as BackendError; // this cast changes from unknown -> typed
        return be.response?.data?.message ?? be.response?.data?.error ?? null;
    }
    return null;
}

type Props = Readonly<{
    token: string;
}>;

export function ResetPasswordForm({ token }: Props) {
    const t = useTranslations('reset');
    const locale = useLocale();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!password) {
            setMessage(t('errorRequired'));
            return;
        }

        try {
            setSubmitting(true);
            const { data, error } = await requestPasswordChange(token, password, locale);

            if (error) {
                // Prefer backend message; fall back to common message
                const backendMsg = extractBackendMessage(error);
                setMessage(backendMsg ?? t('serverError'));
                return;
            }

            setMessage(data?.message ?? t('success'));
        } catch {
            setMessage(t('networkError'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-900">
                    {t('newPassword')}
                </label>
                <input
                    type="password"
                    placeholder={t('newPasswordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border px-3 py-2"
                />
            </div>

            {message && <p className="text-sm text-red-600">{message}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60"
            >
                {submitting ? t('submitting') : t('submitButton')}
            </button>
        </form>
    );
}