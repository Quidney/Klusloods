<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Invoice;
use App\Services\InvoiceService;
use BackedEnum;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FacturenController extends Controller
{
    public function index()
    {
        $invoices = Invoice::where('user_id', Auth::id())
            ->with(['reservation.barcode.tool.price', 'reservation.retour'])
            ->orderByDesc('invoice_date')
            ->orderBy('created_at', 'desc')
            ->get();

        $mappedFacturen = $invoices->map(function ($invoice) {
            $reservation = $invoice->reservation;
            $breakdown = $reservation ? InvoiceService::calculateTotals($reservation) : [
                'product_type' => 'Onbekend product',
                'period' => '-',
                'total' => 0,
            ];

            return [
                'id' => $invoice->id,
                'factuurnummer' => $invoice->invoice_number,
                'datum' => Carbon::parse($invoice->invoice_date ?? $invoice->created_at)->format('d-m-Y'),
                'periode' => $breakdown['period'],
                'omschrijving' => $breakdown['product_type'],
                'bedrag' => '€ ' . number_format($breakdown['total'], 2, ',', '.'),
                'status' => ucfirst($invoice->paymentstatus ?? 'openstaand'),
                'pdf_path' => route('invoices.print', $invoice),
            ];
        });

        return Inertia::render('klant/facturen', [
            'facturen' => $mappedFacturen
        ]);
    }

    public function adminIndex()
    {
        $invoices = Invoice::with(['user', 'reservation.barcode.tool.price', 'reservation.retour'])
            ->orderByDesc('invoice_date')
            ->orderByDesc('created_at')
            ->get();

        $mappedInvoices = $invoices->map(function (Invoice $invoice) {
            $reservation = $invoice->reservation;
            $breakdown = $reservation ? InvoiceService::calculateTotals($reservation) : [
                'product_type' => 'Onbekend product',
                'period' => '-',
                'total' => 0,
            ];

            return [
                'id' => $invoice->id,
                'factuurnummer' => $invoice->invoice_number,
                'datum' => Carbon::parse($invoice->invoice_date ?? $invoice->created_at)->format('d-m-Y'),
                'klant' => $invoice->user?->name ?? 'Onbekend',
                'email' => $invoice->user?->email ?? '-',
                'product' => $breakdown['product_type'],
                'periode' => $breakdown['period'],
                'bedrag' => number_format($breakdown['total'], 2, ',', '.'),
                'status' => ucfirst($invoice->paymentstatus ?? 'openstaand'),
                'print_url' => route('invoices.print', $invoice),
            ];
        });

        return Inertia::render('admin/facturen', [
            'invoices' => $mappedInvoices,
        ]);
    }

    public function print(Invoice $invoice)
    {
        $invoice->loadMissing(['user', 'reservation.barcode.tool.price', 'reservation.retour']);
        $company = Company::query()->first();

        $user = Auth::user();
        $role = $user?->role;

        if ($role instanceof BackedEnum) {
            $role = $role->value;
        }

        if ($user?->id !== $invoice->user_id && $role !== 'beheerder') {
            abort(403);
        }

        $breakdown = $invoice->reservation
            ? InvoiceService::calculateTotals($invoice->reservation)
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

        $customer = $invoice->user;
        $customerAddress = $customer
            ? trim("{$customer->street} {$customer->housenumber}, {$customer->postalcode} {$customer->place_of_residence}")
            : '-';

        $deliveryDate = $invoice->reservation?->pickuptime
            ? Carbon::parse($invoice->reservation->pickuptime)->format('d-m-Y')
            : '-';

        return response()->view('invoices.print', [
            'invoice' => $invoice,
            'company' => $company,
            'customerAddress' => $customerAddress,
            'deliveryDate' => $deliveryDate,
            'breakdown' => $breakdown,
        ]);
    }
}