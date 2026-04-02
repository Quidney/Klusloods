<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .highlight { color: #f97316; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Bedankt voor uw reservering, {{ $reservation->user->name }}!</h2>
        <p>Je hebt succesvol een reservering geplaatst bij <span class="highlight">Klusloods</span>.</p>
        
        <hr>
        <p><strong>Product:</strong> {{ $reservation->barcode->tool->name }}</p>
        <p><strong>Periode:</strong> 
            {{ \Carbon\Carbon::parse($reservation->pickuptime)->format('d-m-Y') }} 
            t/m 
            {{ \Carbon\Carbon::parse($reservation->returntime)->format('d-m-Y') }}
        </p>
        <hr>

        <p>We zien je graag verschijnen op de ophaaldag!</p>
        <p>Met vriendelijke groet,<br>Het Klusloods Team</p>
    </div>
</body>
</html>