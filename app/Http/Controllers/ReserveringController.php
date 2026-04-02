<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Barcode;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class ReserveringController extends Controller
{
    public function index()
    {
        $tools = Tool::with(['price', 'barcode', 'category'])->get();

        return Inertia::render('klant/producten', [
            'tools' => $tools
        ]);
    }

    public function show($id)
    {
        $tool = Tool::with(['category', 'barcode.reservation', 'price'])->findOrFail($id);

        $tool->stockCount = $tool->barcode->where('status', 'beschikbaar')->count();

        $price = $tool->price->sortByDesc('created_at')->first();

        $tool->detailed_price = [
            'day' => $price->dayprice ?? 0,
            'week' => $price->weekprice ?? 0,
            'deposit' => $price->deposit ?? 0,
        ];

        $existingReservations = $tool->barcode->flatMap(function ($barcode) {
            return $barcode->reservation->map(function ($res) {
                return [
                    'barcode_id' => $res->barcode_id,
                    'pickup_date' => date('Y-m-d', strtotime($res->pickuptime)),
                    'return_date' => date('Y-m-d', strtotime($res->returntime)),
                ];
            });
        });

        return Inertia::render('klant/product', [
            'tool' => $tool,
            'existingReservations' => $existingReservations
        ]);
    }

    public function store(Request $request)
    {
        $maxDate = now()->addDays(30)->format('Y-m-d');

        $request->validate([
            'tool_id' => 'required|exists:tools,id',
            'pickupDate' => "required|date|after_or_equal:today|before_or_equal:$maxDate",
            'returnDate' => "required|date|after_or_equal:pickupDate|before_or_equal:$maxDate",
        ]);

        $start = $request->pickupDate . ' 00:00:00';
        $end = $request->returnDate . ' 23:59:59';

        $availableBarcode = Barcode::where('tool_id', $request->tool_id)
            ->whereDoesntHave('reservation', function ($query) use ($start, $end) {
                $query->where(function ($q) use ($start, $end) {
                    $q->where('pickuptime', '<=', $end)
                    ->where('returntime', '>=', $start);
                });
            })
            ->first();

        if (!$availableBarcode) {
            return back()->withErrors(['error' => 'Helaas, alle exemplaren zijn al gereserveerd voor deze periode.']);
        }

        $reservation = new Reservation();
        $reservation->user_id = Auth::id();
        $reservation->barcode_id = $availableBarcode->id;
        $reservation->pickuptime = $start;
        $reservation->returntime = $end;
        $reservation->status = 'gereserveerd';
        $reservation->save();
        if ($request->pickupDate === date('Y-m-d')) {
            $availableBarcode->status = 'verhuurd';
            $availableBarcode->save();
        }

        return back()->with('success', 'Reservering succesvol geplaatst!');
    }
}