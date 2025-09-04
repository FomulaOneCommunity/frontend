'use client';

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import {
    XMarkIcon,
    UserIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    BellIcon,
    BookmarkIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { SidebarProps } from "@/types/Auth";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ open, onCloseAction }: Readonly<SidebarProps>) {
    return (
        <>
            {/* 📱 모바일 Sidebar */}
            <Dialog open={open} onClose={onCloseAction} className="relative z-50 xl:hidden">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                <Dialog.Panel className="fixed inset-y-0 left-0 w-64 bg-white p-6">
                    {/* 상단 프로필 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <img
                                alt="Profile"
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=F1Fan"
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">F1Fan_07</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Ferrari / Leclerc</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onCloseAction(false)}
                            className="rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* 메뉴 */}
                    <nav className="mt-6">
                        <p className="px-2 text-xs font-semibold text-gray-400">내 활동</p>
                        <ul className="mt-2 space-y-1">
                            <SidebarLink href="/mypage/posts" icon={UserIcon} label="내가 쓴 글" />
                            <SidebarLink href="/mypage/comments" icon={ChatBubbleLeftRightIcon} label="내 댓글" />
                            <SidebarLink href="/mypage/bookmarks" icon={BookmarkIcon} label="북마크 / 좋아요" />
                            <SidebarLink href="/mypage/polls" icon={ChartBarIcon} label="투표 & 설문 참여 내역" />
                        </ul>

                        <p className="mt-6 px-2 text-xs font-semibold text-gray-400">설정</p>
                        <ul className="mt-2 space-y-1">
                            <SidebarLink href="/mypage/settings" icon={Cog6ToothIcon} label="계정 관리" />
                            <SidebarLink href="/mypage/notifications" icon={BellIcon} label="알림 설정" />
                        </ul>
                    </nav>
                </Dialog.Panel>
            </Dialog>

            {/* 🖥 데스크탑 Sidebar */}
            <div className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-72 xl:flex-col border-r border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
                <div className="flex grow flex-col gap-y-5 p-6 overflow-y-auto">
                    {/* 프로필 */}
                    <div className="flex items-center gap-x-3">
                        <Image
                            alt="Profile"
                            src="https://upload.wikimedia.org/wikipedia/commons/0/0d/F1_%28registered_trademark%29.svg"
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">F1Fan_07</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ferrari / Leclerc</p>
                        </div>
                    </div>

                    {/* 메뉴 */}
                    <nav className="mt-6 flex-1">
                        <p className="px-2 text-xs font-semibold text-gray-400">내 활동</p>
                        <ul className="mt-2 space-y-1">
                            <SidebarLink href="/mypage/posts" icon={UserIcon} label="내가 쓴 글" />
                            <SidebarLink href="/mypage/comments" icon={ChatBubbleLeftRightIcon} label="내 댓글" />
                            <SidebarLink href="/mypage/bookmarks" icon={BookmarkIcon} label="북마크 / 좋아요" />
                            <SidebarLink href="/mypage/polls" icon={ChartBarIcon} label="투표 & 설문 참여 내역" />
                        </ul>

                        <p className="mt-6 px-2 text-xs font-semibold text-gray-400">설정</p>
                        <ul className="mt-2 space-y-1">
                            <SidebarLink href="/mypage/settings" icon={Cog6ToothIcon} label="계정 관리" />
                            <SidebarLink href="/mypage/notifications" icon={BellIcon} label="알림 설정" />
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

function SidebarLink({
                         href,
                         icon: Icon,
                         label,
                     }: {
    readonly href: string;
    readonly icon: React.ElementType;
    readonly label: string;
}) {
    return (
        <li>
            <a
                href={href}
                className={classNames(
                    'flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                )}
            >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
            </a>
        </li>
    );
}