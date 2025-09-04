'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import Sidebar from '@/components/navbar/Sidebar';
import useAuth from '@/hooks/useAuth';

export default function UserPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = useAuth();

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
            {/* 📱 모바일 + 🖥 데스크탑 Sidebar */}
            <Sidebar
                open={sidebarOpen}
                onCloseAction={setSidebarOpen}
            />

            {/* 오른쪽 본문 영역 (스크롤 가능) */}
            <div className="flex-1 overflow-y-auto">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="divide-y divide-gray-200 dark:divide-white/10">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                    Personal Information
                                </h2>
                                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                                    Use a permanent address where you can receive mail.
                                </p>
                            </div>

                            <form className="md:col-span-2">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                    <div className="col-span-full flex items-center gap-x-8">
                                        <Image
                                            alt="User avatar"
                                            src={auth?.profileImageBase64 ?? "https://upload.wikimedia.org/wikipedia/commons/0/0d/F1_%28registered_trademark%29.svg"}
                                            width={96}
                                            height={96}
                                        />
                                        <div>
                                            <button
                                                type="button"
                                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
                                            >
                                                Change avatar
                                            </button>
                                            <p className="mt-2 text-xs/5 text-gray-500 dark:text-gray-400">
                                                JPG, GIF or PNG. 1MB max.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label
                                            htmlFor="first-name"
                                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                                        >
                                            First name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="first-name"
                                                name="first-name"
                                                type="text"
                                                autoComplete="given-name"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label
                                            htmlFor="last-name"
                                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                                        >
                                            Last name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="last-name"
                                                name="last-name"
                                                type="text"
                                                autoComplete="family-name"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                                        >
                                            Email address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label
                                            htmlFor="username"
                                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                                        >
                                            Username
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                                                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 dark:text-gray-400">
                                                    example.com/
                                                </div>
                                                <input
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    placeholder="janesmith"
                                                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:text-white dark:placeholder:text-gray-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label
                                            htmlFor="timezone"
                                            className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                                        >
                                            Timezone
                                        </label>
                                        <div className="mt-2 grid grid-cols-1">
                                            <select
                                                id="timezone"
                                                name="timezone"
                                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-indigo-500"
                                            >
                                                <option>Pacific Standard Time</option>
                                                <option>Eastern Standard Time</option>
                                                <option>Greenwich Mean Time</option>
                                            </select>
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Delete account */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                    Delete account
                                </h2>
                                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                                    No longer want to use our service? You can delete your account
                                    here. This action is not reversible. All information related
                                    to this account will be deleted permanently.
                                </p>
                            </div>

                            <form className="flex items-start md:col-span-2">
                                <button
                                    type="submit"
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400"
                                >
                                    Yes, delete my account
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}