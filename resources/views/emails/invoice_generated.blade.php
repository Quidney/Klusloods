<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .highlight { color: #f97316; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .table td, .table th { border: 1px solid #ddd; padding: 8px; }
        .table th { background: #f9fafb; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Uw factuur staat klaar, {{ $invoice->user->name }}.</h2>
        <p>Factuurnummer: <span class="highlight">{{ $invoice->invoice_number }}</span></p>
        <p>Factuurdatum: {{ \Carbon\Carbon::parse($invoice->invoice_date ?? $invoice->created_at)->format('d-m-Y') }}</p>

        <table class="table">
            <tr>
                <th>Producttype</th>
                <td>{{ $breakdown['product_type'] }}</td>
            </tr>
            <tr>
                <th>Periode</th>
                <td>{{ $breakdown['period'] }}</td>
            </tr>
            <tr>
                <th>Huurkosten</th>
                <td>€ {{ number_format($breakdown['rental_costs'], 2, ',', '.') }}</td>
            </tr>
            <tr>
                <th>Borg</th>
                <td>€ {{ number_format($breakdown['deposit'], 2, ',', '.') }}</td>
            </tr>
            <tr>
                <th>Schade / extra kosten</th>
                <td>€ {{ number_format($breakdown['extra_costs'], 2, ',', '.') }}</td>
            </tr>
            <tr>
                <th>Totaal</th>
                <td><strong>€ {{ number_format($breakdown['total'], 2, ',', '.') }}</strong></td>
            </tr>
        </table>

        <p style="margin-top:16px;">
            Factuur printen: <a href="{{ $printUrl }}">{{ $printUrl }}</a>
        </p>
    </div>
</body>
</html>
