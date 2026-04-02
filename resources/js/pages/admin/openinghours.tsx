import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import RoleToolbar from '@/components/role-toolbar';

type OpeningHourRow = {
    id: number;
    day: string;
    startime: string | null;
    endtime: string | null;
    status: 'open' | 'gesloten';
};

const dayLabel: Record<string, string> = {
    maandag: 'Maandag',
    dinsdag: 'Dinsdag',
    woensdag: 'Woensdag',
    donderdag: 'Donderdag',
    vrijdag: 'Vrijdag',
    zaterdag: 'Zaterdag',
    zondag: 'Zondag',
};

function toInputTime(value: string | null) {
    if (!value) {
        return '';
    }

    return value.slice(0, 5);
}

export default function OpeningHoursPage({ openinghours }: { openinghours: OpeningHourRow[] }) {
    const page = usePage().props as { errors?: { openinghours?: string } };
    const [rows, setRows] = useState<OpeningHourRow[]>(openinghours);
    const [isSaving, setIsSaving] = useState(false);

    function updateRow(id: number, key: 'status' | 'startime' | 'endtime', value: string) {
        setRows((currentRows) =>
            currentRows.map((row) => {
                if (row.id !== id) {
                    return row;
                }

                if (key === 'status') {
                    const status = value as 'open' | 'gesloten';

                    return {
                        ...row,
                        status,
                        startime: status === 'gesloten' ? null : row.startime,
                        endtime: status === 'gesloten' ? null : row.endtime,
                    };
                }

                return {
                    ...row,
                    [key]: value || null,
                };
            }),
        );
    }

    function submit() {
        setIsSaving(true);

        router.put(
            '/admin/openingstijden',
            {
                openinghours: rows.map((row) => ({
                    id: row.id,
                    day: row.day,
                    status: row.status,
                    startime: row.startime ? row.startime.slice(0, 5) : null,
                    endtime: row.endtime ? row.endtime.slice(0, 5) : null,
                })),
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <RoleToolbar role="beheerder" />

            <main className="mx-auto w-full max-w-5xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Openingstijden</h1>
                        <p className="mt-1 text-slate-500">Stel per weekdag in wanneer afhalen en retourneren mogelijk is.</p>
                    </div>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />
                        Opslaan
                    </button>
                </div>

                {page.errors?.openinghours && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {page.errors.openinghours}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-900 text-sm font-bold tracking-wider text-white uppercase">
                                <th className="px-6 py-4">Dag</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Starttijd</th>
                                <th className="px-6 py-4">Eindtijd</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row) => {
                                const isOpen = row.status === 'open';

                                return (
                                    <tr key={row.id}>
                                        <td className="px-6 py-4 font-semibold">{dayLabel[row.day] ?? row.day}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={row.status}
                                                onChange={(event) => updateRow(row.id, 'status', event.target.value)}
                                                className="w-36 rounded-md border border-slate-300 px-3 py-2"
                                            >
                                                <option value="open">Open</option>
                                                <option value="gesloten">Gesloten</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="time"
                                                value={toInputTime(row.startime)}
                                                disabled={!isOpen}
                                                onChange={(event) => updateRow(row.id, 'startime', event.target.value)}
                                                className="rounded-md border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="time"
                                                value={toInputTime(row.endtime)}
                                                disabled={!isOpen}
                                                onChange={(event) => updateRow(row.id, 'endtime', event.target.value)}
                                                className="rounded-md border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
