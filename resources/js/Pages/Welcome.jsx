import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ trades, filters }) {
    const [date, setDate] = useState(filters?.date ?? '');

    function search(e) {
        e.preventDefault();
        router.get('/', { date }, { preserveState: true, replace: true });
    }

    function clearSearch() {
        setDate('');
        router.get('/', {}, { preserveState: true, replace: true });
    }

    function goToPage(url) {
        if (url) router.get(url, {}, { preserveState: true });
    }

    return (
        <>
            <Head title="Trades" />

            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>Trades</h1>

                <form onSubmit={search} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={{ padding: '0.4rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button type="submit" style={btnStyle('#2563eb')}>Buscar</button>
                    {filters?.date && (
                        <button type="button" onClick={clearSearch} style={btnStyle('#6b7280')}>Limpiar</button>
                    )}
                </form>


                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                                {['ID', 'Ticket', 'Symbol', 'Type', 'Volume', 'Price Open', 'diff_sl', 'Stop Loss', 'diff_tp', 'Take Profit', 'Magic', 'Retcode', 'Status', 'Created At'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {trades.data.length === 0 ? (
                                <tr>
                                    <td colSpan={13} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                        Sin resultados
                                    </td>
                                </tr>
                            ) : trades.data.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={tdStyle}>{t.id}</td>
                                    <td style={tdStyle}>{t.ticket}</td>
                                    <td style={tdStyle}>{t.symbol}</td>
                                    <td style={tdStyle}>{t.type}</td>
                                    <td style={tdStyle}>
                                        {t.volume != null ? Number(t.volume).toFixed(2) : "-"}
                                    </td>
                                    <td style={tdStyle}>
                                        {t.price_open != null ? Number(t.price_open).toFixed(2) : "-"}
                                    </td>
                                    <td style={tdStyle}>
                                        {t.diff_sl != null ? Number(t.diff_sl).toFixed(2) : "-"}
                                    </td>
                                    <td style={tdStyle}>
                                        {t.stop_loss != null ? Number(t.stop_loss).toFixed(2) : "-"}
                                    </td>
                                    <td style={tdStyle}>
                                        {t.diff_tp != null ? Number(t.diff_tp).toFixed(2) : "-"}
                                    </td>
                                    <td style={tdStyle}>
                                        {t.take_profit != null ? Number(t.take_profit).toFixed(2) : "-"}
                                    </td>
                                    <td style={tdStyle}>{t.magic_number}</td>
                                    <td style={tdStyle}>{t.retcode}</td>
                                    <td style={tdStyle}>{t.status}</td>
                                    <td style={tdStyle}>
                                        {new Date(t.created_at).toLocaleString("es-BO", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {trades.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(link.url)}
                            disabled={!link.url || link.active}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            style={{
                                padding: '0.3rem 0.7rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                cursor: link.url && !link.active ? 'pointer' : 'default',
                                background: link.active ? '#2563eb' : '#fff',
                                color: link.active ? '#fff' : '#374151',
                                fontWeight: link.active ? 'bold' : 'normal',
                                opacity: !link.url ? 0.4 : 1,
                            }}
                        />
                    ))}
                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                        {trades.from}–{trades.to} de {trades.total}
                    </span>
                </div>
            </div>
        </>
    );
}

const thStyle = { padding: '0.5rem 0.75rem', fontWeight: '600', whiteSpace: 'nowrap', borderBottom: '2px solid #e5e7eb' };
const tdStyle = { padding: '0.45rem 0.75rem', whiteSpace: 'nowrap' };
const btnStyle = bg => ({ padding: '0.4rem 0.9rem', background: bg, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' });
