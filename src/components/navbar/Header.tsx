'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {useTranslations} from 'next-intl'
import Languages from '@/components/Languages'
import UserDropdown from '@/components/navbar/UserDropdown';
import NavbarLogo from '@/components/navbar/NavbarLogo';
import useAuth from '@/hooks/useAuth';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const t = useTranslations('header')

    const {auth, isAuthenticated, logout} = useAuth();

    return (
        <header className="relative isolate z-10 bg-white">
            <nav aria-label="Global"
                 className="flex max-w-full items-center justify-between p-6 lg:px-8 border-b border-gray-300">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5" aria-label="Home">
                        <NavbarLogo/> {/* Logo is not a link internally */}
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">{t('openMenu')}</span>
                        <Bars3Icon aria-hidden="true" className="size-6"/>
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">

                    <Link href="#" className="text-sm/6 font-semibold text-gray-900">
                        {t('news')}
                    </Link>
                    <Link href="#" className="text-sm/6 font-semibold text-gray-900">
                        {t('beginnerGuide')}
                    </Link>
                    <Popover>
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                            {t('schedule')}
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400"/>
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">

                            </div>
                        </PopoverPanel>
                    </Popover>
                    <Popover>
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                            {t('results')}
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400"/>
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">

                            </div>
                        </PopoverPanel>
                    </Popover>
                    <Popover>
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                            {t('drivers')}
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400"/>
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">

                            </div>
                        </PopoverPanel>
                    </Popover>
                    <Popover>
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                            {t('teams')}
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400"/>
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute inset-x-0 top-0 -z-10 bg-white pt-14 shadow-lg ring-1 ring-gray-900/5 transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-4 px-6 py-10 lg:px-8 xl:gap-x-8">

                            </div>
                        </PopoverPanel>
                    </Popover>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end gap-4">
                    <Languages/> {/* ← 새로 추가 */}
                    {isAuthenticated ? (
                        <UserDropdown/>
                    ) : (
                        <Link href="/signIn" className="text-sm font-semibold text-gray-900">
                            {t('signIn')} <span aria-hidden="true">&rarr;</span>
                        </Link>
                    )}
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50"/>
                <DialogPanel
                    className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <Image
                                alt="F1 Logo"
                                src="/F1_Logo.svg"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">{t('closeMenu')}</span>
                            <XMarkIcon aria-hidden="true" className="size-6"/>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    {t('news')}
                                </Link>
                                <Link
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    {t('beginnerGuide')}
                                </Link>
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        {t('schedule')}
                                        <ChevronDownIcon aria-hidden="true"
                                                         className="size-5 flex-none group-data-open:rotate-180"/>
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">

                                    </DisclosurePanel>
                                </Disclosure>
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        {t('results')}
                                        <ChevronDownIcon aria-hidden="true"
                                                         className="size-5 flex-none group-data-open:rotate-180"/>
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">

                                    </DisclosurePanel>
                                </Disclosure>
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        {t('drivers')}
                                        <ChevronDownIcon aria-hidden="true"
                                                         className="size-5 flex-none group-data-open:rotate-180"/>
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">

                                    </DisclosurePanel>
                                </Disclosure>
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        {t('teams')}
                                        <ChevronDownIcon aria-hidden="true"
                                                         className="size-5 flex-none group-data-open:rotate-180"/>
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">

                                    </DisclosurePanel>
                                </Disclosure>
                            </div>
                            <div className="py-6">
                                {isAuthenticated ? (
                                    <div className="flex flex-col gap-2 px-3">
                                        <div className="flex items-center gap-3">
                                            {/* 프로필 이미지 (base64 or default) */}
                                            {auth?.profileImageBase64 ? (
                                                <Image
                                                    // base64 문자열에 data URI prefix가 없을 수 있으니 보정
                                                    src={
                                                        auth.profileImageBase64.startsWith('data:')
                                                            ? auth.profileImageBase64
                                                            : `data:image/jpeg;base64,${auth.profileImageBase64}`
                                                    }
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                    priority
                                                />
                                            ) : (
                                                // 이미지가 없으면 이니셜 원형 아바타
                                                <div
                                                    className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
                                                    {(auth?.name || auth?.username)?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                            )}

                                            {/* 사용자 이름 (bold) */}
                                            <span className="text-sm font-bold text-gray-900">
    {auth?.name || auth?.username}
  </span>
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600"
                                        >
                                            {t('myPage')}
                                        </Link>

                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="text-sm font-semibold text-red-500 hover:text-red-600 text-left"
                                        >
                                            {t('logout')}
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/signIn"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        {t('signIn')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
