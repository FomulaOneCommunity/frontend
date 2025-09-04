'use client'

import {Listbox} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {DropdownProps} from '@/types/Auth'

export function Dropdown(props: Readonly<DropdownProps>) {
    const {label, items, selected, onChange} = props

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
            <Listbox value={selected} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button
                        className="flex w-full items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900">
                        {selected}
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400"/>
                    </Listbox.Button>
                    <Listbox.Options
                        className="absolute mt-1 w-full max-h-40 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-sm z-50">
                        {items.map((item) => (
                            <Listbox.Option
                                key={item}
                                value={item}
                                className={({active}) =>
                                    `cursor-pointer select-none px-3 py-2 ${
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-700'
                                    }`
                                }
                            >
                                {({selected}) => (
                                    <span className="flex items-center justify-between">
                    {item}
                                        {selected && <CheckIcon className="h-4 w-4 text-indigo-500"/>}
                  </span>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    )
}