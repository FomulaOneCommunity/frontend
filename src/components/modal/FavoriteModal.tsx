'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'
import { FavoriteModalProps } from '@/types/Auth'
import { Dropdown } from '@/components/dropdown/Dropdown'

// 2025년 기준 F1 팀 데이터
const f1Data = [
    { team: "McLaren", drivers: ["Lando Norris", "Oscar Piastri"] },
    { team: "Ferrari", drivers: ["Charles Leclerc", "Lewis Hamilton"] },
    { team: "Red Bull Racing", drivers: ["Max Verstappen", "Liam Lawson"] },
    { team: "Mercedes", drivers: ["George Russell", "Kimi Antonelli"] },
    { team: "Aston Martin", drivers: ["Fernando Alonso", "Lance Stroll"] },
    { team: "Alpine", drivers: ["Pierre Gasly", "Jack Doohan"] },
    { team: "Haas", drivers: ["Oliver Bearman", "Esteban Ocon"] },
    { team: "Racing Bulls", drivers: ["Yuki Tsunoda", "Isack Hadjar"] },
    { team: "Williams", drivers: ["Alexander Albon", "Carlos Sainz Jr."] },
    { team: "Sauber", drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"] }
];

export default function FavoriteModal(props: Readonly<FavoriteModalProps>) {
    const { open, onClose, onSubmit } = props
    const [selectedTeam, setSelectedTeam] = useState(f1Data[0].team)
    const [selectedDriver, setSelectedDriver] = useState(f1Data[0].drivers[0])

    // 현재 팀에 해당하는 드라이버 목록
    const currentDrivers = f1Data.find(t => t.team === selectedTeam)?.drivers ?? []

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0"
            />

            <div className="fixed inset-0 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel
                        transition
                        className="relative transform rounded-lg bg-white px-6 py-5 text-left shadow-xl transition-all
                       data-closed:translate-y-4 data-closed:opacity-0 sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                    >
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                            좋아하는 선수나 팀이 있나요?
                        </DialogTitle>

                        <div className="mt-4 space-y-4">
                            {/* 팀 선택 드롭다운 */}
                            <Dropdown
                                label="팀 선택"
                                items={f1Data.map(t => t.team)}
                                selected={selectedTeam}
                                onChange={(team) => {
                                    setSelectedTeam(team)
                                    const teamDrivers = f1Data.find(t => t.team === team)?.drivers ?? []
                                    setSelectedDriver(teamDrivers[0])
                                }}
                            />

                            {/* 선택된 팀의 드라이버만 표시 */}
                            <Dropdown
                                label="선수 선택"
                                items={currentDrivers}
                                selected={selectedDriver}
                                onChange={setSelectedDriver}
                            />
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onSubmit?.(null, null)
                                    onClose()
                                    setSelectedTeam(f1Data[0].team)
                                    setSelectedDriver(f1Data[0].drivers[0])
                                }}
                                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                                건너뛰기
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // onSubmit이 닫기까지 책임지게
                                    onSubmit?.(selectedTeam, selectedDriver)
                                }}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                확인
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
