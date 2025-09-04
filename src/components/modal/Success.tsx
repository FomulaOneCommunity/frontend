'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

type SuccessProps = {
    readonly open: boolean;
    readonly onClose: () => void;
    readonly title: string;
    readonly description?: string;
    readonly confirmText?: string;
    readonly onConfirm?: () => void;
};

export default function Success({
                                    open,
                                    onClose,
                                    title,
                                    description,
                                    confirmText = '확인',
                                    onConfirm,
                                }: SuccessProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in dark:bg-gray-900/50"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape") {
                                onConfirm?.();   // Enter 시 확인 로직 실행
                                onClose();       // 모달 닫기
                            }
                        }}
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all
                       data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out
                       data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6
                       data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10"
                    >
                        <div>
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                                <CheckIcon aria-hidden="true" className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <DialogTitle as="h3" className="text-base font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </DialogTitle>
                                {description && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    onConfirm?.();
                                    onClose();
                                }}
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
