'use client'

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export default function Languages() {
    const t = useTranslations('languages')
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    /** 현재 path 에서 기존 locale prefix 제거 */
    const stripLocale = (path: string, locale: string) => {
        const regex = new RegExp(`^/${locale}(?=/|$)`)
        const stripped = path.replace(regex, '')
        return stripped.startsWith('/') ? stripped : `/${stripped}`
    }

    const handleLanguageChange = (code: string) => {
        if (code === locale) return
        const nextPath = `/${code}${stripLocale(pathname, locale)}`
        router.push(nextPath === `/${code}/` ? `/${code}` : nextPath)
    }

    /** 드롭다운에 표시할 언어 목록 */
    const languageList = [
        { code: 'en', label: t('labels.en') },
        { code: 'ko', label: t('labels.ko') },
    ] as const

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900">
                    {t('title')}
                    <ChevronDownIcon aria-hidden className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
            </div>

            <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none">
                <div className="py-1">
                    {languageList.map(({ code, label }) => (
                        <MenuItem key={code}>
                            {({ focus }) => {
                                let className = 'block w-full px-4 py-2 text-left text-sm'
                                if (focus) {
                                    className += ' bg-gray-100 text-gray-900'
                                } else if (code === locale) {
                                    className += ' font-medium text-gray-900'
                                } else {
                                    className += ' text-gray-700'
                                }

                                return (
                                    <button
                                        onClick={() => handleLanguageChange(code)}
                                        className={className}
                                    >
                                        {label}
                                    </button>
                                )
                            }}
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    )
}