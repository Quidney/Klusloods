<?php

namespace App\Observers;

use App\Models\Reservation;
use App\Services\InvoiceService;

class ReservationObserver
{
    public function updated(Reservation $reservation): void
    {
        if ($reservation->wasChanged('status') && $reservation->status === 'afgerond') {
            app(InvoiceService::class)->generateForReservation($reservation);
        }
    }
}
