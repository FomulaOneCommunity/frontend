'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import useAuth from '@/hooks/useAuth';

export default function HomePage() {
    const t = useTranslations('HomePage');
    const { auth, isAuthenticated } = useAuth();

    return (
        <>
            <h1 className="text-2xl font-bold">{t('title')}</h1>

            {isAuthenticated ? (
                <p className="mt-4 text-lg">
                    {t('welcome', { name: auth?.name ?? auth?.username ?? '' })}
                </p>
            ) : (
                <p className="mt-4 text-lg text-gray-500">{t('pleaseLogin')}</p>
            )}

            <div className="mt-6">
                <Link href="/about" className="text-indigo-600 hover:underline">
                    {t('about')}
                </Link>
            </div>
        </>
    );
}