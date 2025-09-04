'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-12">
                <p className="text-center text-sm/6 text-gray-600">
                    &copy; 2025 {t('company')}. {t('allRightsReserved')}
                </p>
            </div>
        </footer>
    );
}