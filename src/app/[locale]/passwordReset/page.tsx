'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from './PasswordResetForm';

export default function ResetPasswordPage() {
    const t = useTranslations('resetPasswordPage');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-600">{t('invalidAccess')}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}