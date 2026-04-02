<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Invoice $invoice)
    {
        $this->invoice->loadMissing(['user', 'reservation.barcode.tool.price', 'reservation.retour']);
    }

    public function build(): self
    {
        $breakdown = InvoiceService::calculateTotals($this->invoice->reservation);

        return $this->subject('Uw factuur van Klusloods: '.$this->invoice->invoice_number)
            ->view('emails.invoice_generated', [
                'invoice' => $this->invoice,
                'breakdown' => $breakdown,
                'printUrl' => route('invoices.print', $this->invoice),
            ]);
    }
}
