<?php

namespace App\Services;

use App\Mail\InvoiceGenerated;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\Reservation;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function generateForReservation(Reservation $reservation): ?Invoice
    {
        $reservation->loadMissing(['user', 'barcode.tool.price', 'retour']);

        if ($reservation->status === 'geannuleerd' || $reservation->status !== 'afgerond') {
            return null;
        }

        $existing = Invoice::where('reservation_id', $reservation->id)->first();
        if ($existing) {
            if (empty($existing->filepath)) {
                $existing->filepath = $this->generateAndStorePdf($existing);
                $existing->save();
            }

            return $existing;
        }

        $invoiceNumber = $this->generateInvoiceNumber($reservation);

        $invoice = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'invoice_date' => now()->toDateString(),
            'user_id' => $reservation->user_id,
            'reservation_id' => $reservation->id,
            'filepath' => '',
            'paymentstatus' => 'openstaand',
        ]);

        $invoice->filepath = $this->generateAndStorePdf($invoice);
        $invoice->save();

        if ($reservation->user?->email) {
            Mail::to($reservation->user->email)->send(new InvoiceGenerated($invoice));
        }

        return $invoice;
    }

    public static function calculateTotals(Reservation $reservation): array
    {
        $reservation->loadMissing(['barcode.tool.price', 'retour']);
        $company = Company::query()->first();

        $price = $reservation->barcode?->tool?->price?->sortByDesc('created_at')->first();

        $pickup = Carbon::parse($reservation->pickuptime)->startOfDay();
        $returnDate = Carbon::parse($reservation->retour?->actualreturntime ?? $reservation->returntime)->startOfDay();

        $days = max(1, $pickup->diffInDays($returnDate) + 1);

        $dayPrice = (float) ($price->dayprice ?? 0);
        $weekPrice = (float) ($price->weekprice ?? ($dayPrice * 7));
        $deposit = (float) ($price->deposit ?? 0);
        $extraCosts = (float) ($reservation->retour?->cost ?? 0);

        $weeks = intdiv($days, 7);
        $remainingDays = $days % 7;

        $rentalCosts = ($weeks * $weekPrice) + ($remainingDays * $dayPrice);
        $subtotal = $rentalCosts + $deposit + $extraCosts;
        $vatRate = (float) ($company?->vat_rate ?? 0);
        $vatAmount = $subtotal * ($vatRate / 100);
        $total = $subtotal + $vatAmount;

        return [
            'product_type' => $reservation->barcode?->tool?->name ?? 'Onbekend product',
            'period' => sprintf('%s t/m %s', $pickup->format('d-m-Y'), $returnDate->format('d-m-Y')),
            'days' => $days,
            'rental_costs' => round($rentalCosts, 2),
            'deposit' => round($deposit, 2),
            'extra_costs' => round($extraCosts, 2),
            'vat_rate' => round($vatRate, 2),
            'vat_amount' => round($vatAmount, 2),
            'subtotal' => round($subtotal, 2),
            'total' => round($total, 2),
        ];
    }

    private function generateAndStorePdf(Invoice $invoice): string
    {
        $invoice->loadMissing(['user', 'reservation.barcode.tool.price', 'reservation.retour']);

        $company = Company::query()->first();
        $customer = $invoice->user;

        $customerAddress = $customer
            ? trim("{$customer->street} {$customer->housenumber}, {$customer->postalcode} {$customer->place_of_residence}")
            : '-';

        $deliveryDate = $invoice->reservation?->pickuptime
            ? Carbon::parse($invoice->reservation->pickuptime)->format('d-m-Y')
            : '-';

        $breakdown = $invoice->reservation
            ? self::calculateTotals($invoice->reservation)
            : [
                'product_type' => 'Onbekend product',
                'period' => '-',
                'days' => 0,
                'rental_costs' => 0,
                'deposit' => 0,
                'extra_costs' => 0,
                'vat_rate' => 0,
                'vat_amount' => 0,
                'subtotal' => 0,
                'total' => 0,
            ];

        $pdf = Pdf::loadView('invoices.print', [
            'invoice' => $invoice,
            'company' => $company,
            'customerAddress' => $customerAddress,
            'deliveryDate' => $deliveryDate,
            'breakdown' => $breakdown,
            'isPdf' => true,
        ])->setPaper('a4', 'portrait');

        $relativePath = 'invoices/'.$invoice->invoice_number.'.pdf';
        Storage::disk('public')->put($relativePath, $pdf->output());

        return $relativePath;
    }

    private function generateInvoiceNumber(Reservation $reservation): string
    {
        $base = sprintf('INV-%s-%d', now()->format('YmdHis'), $reservation->id);
        $candidate = $base;
        $counter = 1;

        while (Invoice::where('invoice_number', $candidate)->exists()) {
            $candidate = $base.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }
}
