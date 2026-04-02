<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;

    public function __construct(Reservation $reservation)
    {
        // We laden de relaties zodat we de naam van de tool en de gebruiker hebben
        $this->reservation = $reservation->load(['barcode.tool', 'user']);
    }

    public function build()
    {
        return $this->subject('Bevestiging van uw reservering - Klusloods')
                    ->view('emails.reservation_confirmed');
    }
}