'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronDownIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/20/solid';
import useAuth from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';

export default function UserDropdown() {
    const t = useTranslations('userMenu');
    const { auth, logout } = useAuth();

    const userMenu = [
        {
            name: t('myPage.name'),
            description: t('myPage.description'),
            href: '/userPage', // ← 내부 라우팅
        },
    ];

    return (
        <Popover className="relative">
            {({ close }) => (
                <>
                    <PopoverButton className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-indigo-600">
                        {auth?.profileImageBase64 ? (
                            <Image
                                src={auth.profileImageBase64} // data:image/...;base64,xxx 가능
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white">
                                {auth?.username?.charAt(0).toUpperCase() || '?'}
                            </div>
                        )}
                        <ChevronDownIcon aria-hidden="true" className="size-5" />
                    </PopoverButton>

                    <PopoverPanel
                        transition
                        className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                        <div className="p-4">
                            {userMenu.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => close()}
                                    className="group flex items-start gap-3 rounded-md hover:bg-gray-50 p-2"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-gray-200">
                            <button
                                onClick={() => {
                                    close();
                                    logout();
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-red-500 hover:bg-gray-100"
                            >
                                <ArrowRightStartOnRectangleIcon className="size-5 text-red-400" />
                                {t('logout')}
                            </button>
                        </div>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    );
}