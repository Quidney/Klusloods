<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class FacturenController extends Controller
{
    public function index()
    {
        $invoices = Invoice::where('user_id', Auth::id())
            ->with(['reservation.barcode.tool.price']) 
            ->orderBy('created_at', 'desc')
            ->get();

        $mappedFacturen = $invoices->map(function ($invoice) {
            $reservation = $invoice->reservation;
            
            if (!$reservation || !$reservation->barcode || !$reservation->barcode->tool) {
                return $this->formatData($invoice, "Onbekend product", 0);
            }

            $tool = $reservation->barcode->tool;
            $price = $tool->price->first(); 

            if (!$price) {
                return $this->formatData($invoice, $tool->name, 0);
            }

            $start = Carbon::parse($reservation->start_date);
            $end = Carbon::parse($reservation->end_date);
            $totalDays = max(1, $start->diffInDays($end));
            
            $weeks = floor($totalDays / 7);
            $remainingDays = $totalDays % 7;

            $totalAmount = ($weeks * $price->weekprice) + ($remainingDays * $price->dayprice);

            return $this->formatData(
                $invoice, 
                $tool->name, 
                $totalAmount
            );
        });

        return Inertia::render('klant/facturen', [
            'facturen' => $mappedFacturen
        ]);
    }

    private function formatData($invoice, $omschrijving, $bedrag)
    {
        return [
            'id'           => $invoice->id,
            'datum'        => $invoice->created_at->format('d-m-Y'),
            'omschrijving' => $omschrijving,
            'bedrag'       => '€ ' . number_format($bedrag, 2, ',', '.'),
            'status'       => $invoice->status ?? 'Openstaand', 
            'pdf_path'     => $invoice->filepath,
        ];
    }
}