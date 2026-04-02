<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factuur {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm;
        }

        :root {
            --bg: #f1f5f9;
            --card: #ffffff;
            --text: #0f172a;
            --muted: #64748b;
            --line: #e2e8f0;
            --brand: #f97316;
            --brand-dark: #ea580c;
            --soft: #fff7ed;
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Inter, Segoe UI, Arial, sans-serif;
            background: linear-gradient(180deg, var(--bg) 0%, #ffffff 100%);
            color: var(--text);
            padding: 32px;
        }

        .container {
            max-width: 1040px;
            margin: 0 auto;
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 18px;
            box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
            overflow: hidden;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #fff;
            padding: 22px 28px;
        }

        .brand {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.2px;
        }

        .brand span { color: var(--brand); }

        .invoice-tag {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 999px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 700;
        }

        .content { padding: 28px; }

        .header-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 18px;
        }

        .card {
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 14px;
            background: #fff;
        }

        .card h3 {
            margin: 0 0 10px 0;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: var(--muted);
        }

        .card p { margin: 4px 0; font-size: 14px; }
        .muted { color: var(--muted); }

        .meta {
            border: 1px solid #fed7aa;
            background: var(--soft);
            border-radius: 12px;
            padding: 12px 14px;
            margin-bottom: 18px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px 12px;
            font-size: 13px;
        }

        .meta strong { color: var(--text); }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 10px;
            border: 1px solid var(--line);
            border-radius: 12px;
            overflow: hidden;
            font-size: 13px;
        }

        th, td {
            border-bottom: 1px solid var(--line);
            padding: 11px 10px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background: #f8fafc;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #334155;
            font-weight: 700;
        }

        tbody tr:last-child td { border-bottom: 0; }
        .amount { font-weight: 700; white-space: nowrap; }
        .amount.total { color: var(--brand-dark); font-size: 14px; }

        .summary {
            margin-top: 14px;
            display: flex;
            justify-content: flex-end;
        }

        .summary-box {
            min-width: 260px;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 12px 14px;
            background: #fff;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
            font-size: 14px;
        }

        .summary-row.total {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed var(--line);
            font-size: 16px;
            font-weight: 800;
            color: var(--brand-dark);
        }

        .actions {
            margin-top: 24px;
            display: flex;
            gap: 10px;
        }

        .btn {
            border: 1px solid var(--line);
            background: #fff;
            color: var(--text);
            padding: 10px 14px;
            cursor: pointer;
            border-radius: 8px;
            font-weight: 600;
        }

        .btn.primary {
            background: var(--brand);
            color: #fff;
            border-color: var(--brand);
        }

        .btn.primary:hover { background: var(--brand-dark); }

        @media (max-width: 900px) {
            .header-grid, .meta { grid-template-columns: 1fr; }
            body { padding: 16px; }
        }

        @media print {
            .actions { display: none; }
            body { margin: 0; padding: 0; background: #fff; }
            .container { border: 0; box-shadow: none; border-radius: 0; }

            .topbar { padding: 10px 14px; }
            .content { padding: 10px 12px; }
            .brand { font-size: 16px; }
            .invoice-tag { font-size: 10px; padding: 4px 8px; }
            .meta, .card p, .card h3, .summary-row { font-size: 11px; }

            .responsive-print-table,
            .responsive-print-table thead,
            .responsive-print-table tbody,
            .responsive-print-table tr,
            .responsive-print-table th,
            .responsive-print-table td {
                display: block;
                width: 100%;
            }

            .responsive-print-table thead {
                display: none;
            }

            .responsive-print-table tr {
                border: 1px solid var(--line);
                border-radius: 8px;
                margin-bottom: 8px;
                padding: 2px 0;
                page-break-inside: avoid;
            }

            .responsive-print-table td {
                border: 0;
                border-bottom: 1px dashed #cbd5e1;
                padding: 6px 8px;
                text-align: left;
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
                display: flex;
                gap: 10px;
                align-items: flex-start;
            }

            .responsive-print-table td:last-child {
                border-bottom: 0;
            }

            .responsive-print-table td::before {
                content: attr(data-label);
                font-weight: 700;
                color: #334155;
                min-width: 42%;
                max-width: 42%;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="topbar">
        <div class="brand">De<span>Klusloods</span></div>
        <div class="invoice-tag">Factuur {{ $invoice->invoice_number }}</div>
    </div>

    <div class="content">
        <div class="meta">
            <div><strong>Factuurnummer:</strong> {{ $invoice->invoice_number }}</div>
            <div><strong>Factuurdatum:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date ?? $invoice->created_at)->format('d-m-Y') }}</div>
            <div><strong>Datum levering:</strong> {{ $deliveryDate }}</div>
        </div>

        <div class="header-grid">
            <div class="card">
                <h3>Uw gegevens</h3>
                <p><strong>{{ $company?->name ?? 'Onbekend bedrijf' }}</strong></p>
                <p>{{ $company?->address ?? '-' }}</p>
                <p>KVK: {{ $company?->KvK ?? '-' }}</p>
                <p>BTW: {{ $company?->vat_identification_number ?? '-' }}</p>
            </div>

            <div class="card">
                <h3>Klantgegevens</h3>
                <p><strong>{{ $invoice->user->name }}</strong></p>
                <p>{{ $invoice->user->email }}</p>
                <p>{{ $customerAddress }}</p>
            </div>
        </div>

    <table class="responsive-print-table">
        <thead>
            <tr>
                <th>Producttype</th>
                <th>Aantal</th>
                <th>Periode</th>
                <th>Huurkosten</th>
                <th>Borg</th>
                <th>Schade/extra</th>
                <th>Subtotaal</th>
                <th>BTW</th>
                <th>Totaal incl. BTW</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td data-label="Producttype">{{ $breakdown['product_type'] }}</td>
                <td data-label="Aantal">{{ $breakdown['days'] }} dag(en)</td>
                <td data-label="Periode">{{ $breakdown['period'] }}</td>
                <td data-label="Huurkosten" class="amount">€ {{ number_format($breakdown['rental_costs'], 2, ',', '.') }}</td>
                <td data-label="Borg" class="amount">€ {{ number_format($breakdown['deposit'], 2, ',', '.') }}</td>
                <td data-label="Schade/extra" class="amount">€ {{ number_format($breakdown['extra_costs'], 2, ',', '.') }}</td>
                <td data-label="Subtotaal" class="amount">€ {{ number_format($breakdown['subtotal'], 2, ',', '.') }}</td>
                <td data-label="BTW" class="amount">€ {{ number_format($breakdown['vat_amount'], 2, ',', '.') }}</td>
                <td data-label="Totaal incl. BTW" class="amount total">€ {{ number_format($breakdown['total'], 2, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

        <div class="summary">
            <div class="summary-box">
                <div class="summary-row"><span>Subtotaal</span><strong>€ {{ number_format($breakdown['subtotal'], 2, ',', '.') }}</strong></div>
                <div class="summary-row"><span>BTW ({{ number_format($breakdown['vat_rate'], 2, ',', '.') }}%)</span><strong>€ {{ number_format($breakdown['vat_amount'], 2, ',', '.') }}</strong></div>
                <div class="summary-row total"><span>Totaal incl. BTW</span><span>€ {{ number_format($breakdown['total'], 2, ',', '.') }}</span></div>
            </div>
        </div>

        <p class="muted" style="margin-top: 14px;">Status: {{ ucfirst($invoice->paymentstatus) }}</p>

        <div class="actions">
            <button class="btn primary" onclick="window.print()">Print factuur</button>
            <button class="btn" onclick="goBackFromInvoice()">Terug</button>
        </div>
    </div>
</div>
<script>
    function goBackFromInvoice() {
        const referrer = document.referrer;

        if (referrer) {
            window.location.href = referrer;
            return;
        }

        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        window.location.href = '/';
    }
</script>
@if(request()->boolean('download') || request()->boolean('autoprint'))
    <script>
        window.addEventListener('load', function () {
            window.print();
        });
    </script>
@endif
</body>
</html>
