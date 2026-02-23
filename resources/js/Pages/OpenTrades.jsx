import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function OpenTrades({ openTrades }) {
    const [modal, setModal] = useState(null); // null | { loading: true } | { open, closed }

    function goToPage(url) {
        if (url) router.get(url, {}, { preserveState: true });
    }

    async function verDetalle(ticket) {
        setModal({ loading: true });
        try {
            const res = await fetch(`/operaciones/${ticket}/detail`);
            const data = await res.json();
            setModal({ loading: false, ...data });
        } catch {
            setModal(null);
        }
    }

    function cerrar() {
        setModal(null);
    }

    return (
        <>
            <Head title="Operaciones Abiertas" />

            <div className="min-h-screen bg-gray-50 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Operaciones Abiertas</h1>

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                {['Ticket', 'Symbol', 'Type', 'Volume', 'Price Open', 'Stop Loss', 'Take Profit', 'Account', ''].map(h => (
                                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {openTrades.data.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-10 text-gray-400">
                                        Sin operaciones abiertas
                                    </td>
                                </tr>
                            ) : openTrades.data.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-mono text-gray-700">{t.ticket}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{t.symbol}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            t.type === 'buy'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {t.type?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {t.volume != null ? Number(t.volume).toFixed(2) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {t.price_open != null ? Number(t.price_open).toFixed(5) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {t.stop_loss != null ? Number(t.stop_loss).toFixed(5) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {t.take_profit != null ? Number(t.take_profit).toFixed(5) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{t.account}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => verDetalle(t.ticket)}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 active:bg-blue-800 transition"
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex flex-wrap gap-2 mt-4 items-center">
                    {openTrades.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(link.url)}
                            disabled={!link.url || link.active}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 rounded border text-sm transition ${
                                link.active
                                    ? 'bg-blue-600 text-white border-blue-600 font-bold cursor-default'
                                    : link.url
                                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                                    : 'bg-white text-gray-300 border-gray-200 cursor-default'
                            }`}
                        />
                    ))}
                    {openTrades.total > 0 && (
                        <span className="text-xs text-gray-500">
                            {openTrades.from}–{openTrades.to} de {openTrades.total}
                        </span>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={cerrar}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={cerrar}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none font-bold"
                        >
                            &times;
                        </button>

                        {modal.loading ? (
                            <p className="text-center text-gray-500 py-8">Cargando...</p>

                        ) : modal.closed ? (
                            <>
                                <h2 className="text-lg font-bold text-gray-800 mb-1">
                                    Operación Cerrada
                                </h2>
                                <p className="text-xs text-gray-400 mb-4">Ticket #{modal.open?.ticket}</p>

                                <div className="divide-y divide-gray-100">
                                    <DetailRow label="Symbol"      value={modal.closed.symbol} />
                                    <DetailRow label="Type"        value={modal.closed.type?.toUpperCase()} highlight={modal.closed.type} />
                                    <DetailRow label="Volume"      value={Number(modal.closed.volume).toFixed(2)} />
                                    <DetailRow label="Price Open"  value={Number(modal.closed.price_open).toFixed(5)} />
                                    <DetailRow label="Price Close" value={Number(modal.closed.price_close).toFixed(5)} />
                                    <DetailRow label="Profit"      value={Number(modal.closed.profit).toFixed(2)} profit={modal.closed.profit} />
                                    <DetailRow label="Account"     value={modal.closed.account} />
                                    {modal.closed.closed_at && (
                                        <DetailRow
                                            label="Cerrado en"
                                            value={new Date(modal.closed.closed_at).toLocaleString('es-BO')}
                                        />
                                    )}
                                </div>
                            </>

                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-gray-800 mb-1">
                                    Ticket #{modal.open?.ticket}
                                </h2>
                                <p className="text-xs text-gray-400 mb-4">{modal.open?.symbol}</p>

                                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                    <span className="text-2xl">⏳</span>
                                    <div>
                                        <p className="text-yellow-800 font-semibold">Sigue en ejecución</p>
                                        <p className="text-yellow-600 text-xs mt-0.5">Esta operación aún no ha sido cerrada.</p>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100 mt-4">
                                    <DetailRow label="Type"       value={modal.open?.type?.toUpperCase()} highlight={modal.open?.type} />
                                    <DetailRow label="Volume"     value={modal.open?.volume != null ? Number(modal.open.volume).toFixed(2) : '-'} />
                                    <DetailRow label="Price Open" value={modal.open?.price_open != null ? Number(modal.open.price_open).toFixed(5) : '-'} />
                                    <DetailRow label="Stop Loss"  value={modal.open?.stop_loss != null ? Number(modal.open.stop_loss).toFixed(5) : '-'} />
                                    <DetailRow label="Take Profit" value={modal.open?.take_profit != null ? Number(modal.open.take_profit).toFixed(5) : '-'} />
                                    <DetailRow label="Account"    value={modal.open?.account} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function DetailRow({ label, value, profit, highlight }) {
    let valueClass = 'text-gray-800 font-semibold';

    if (profit !== undefined) {
        valueClass = Number(profit) >= 0
            ? 'text-green-600 font-bold'
            : 'text-red-600 font-bold';
    } else if (highlight) {
        valueClass = highlight === 'buy'
            ? 'text-green-600 font-bold'
            : 'text-red-600 font-bold';
    }

    return (
        <div className="flex justify-between py-2.5">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className={`text-sm ${valueClass}`}>{value ?? '-'}</span>
        </div>
    );
}
