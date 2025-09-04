'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

type WarningProps = {
    readonly open: boolean;
    readonly onClose: () => void;
    readonly title: string;
    readonly description: string;
};

export default function Warning({
                                    open,
                                    onClose,
                                    title,
                                    description,
                                }: WarningProps) {
    const t = useTranslations('warning'); // warning.json namespace 사용

    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape") {
                                onClose();
                            }
                        }}
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white ..."
                    >
                        <div>
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100">
                                <ExclamationTriangleIcon
                                    aria-hidden="true"
                                    className="size-6 text-amber-600"
                                />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <DialogTitle
                                    as="h3"
                                    className="text-base font-semibold text-gray-900"
                                >
                                    {title || t('defaultTitle')}
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">{description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}