<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Barcode;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReserveringController extends Controller
{
    public function index()
    {
        $tools = Tool::with(['price', 'barcode', 'category'])->get();

        return Inertia::render('klant/producten', [
            'tools' => $tools
        ]);
    }

    public function show(Request $request, $id)
    {
        $tool = Tool::with([
            'category', 
            'barcode.reservation' => function($query) {
                $query->whereIn('status', ['gereserveerd', 'uitgegeven']);
            }, 
            'price'
        ])->findOrFail($id);

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
                    'id' => $res->id, // Belangrijk voor de edit check
                    'barcode_id' => $res->barcode_id,
                    'pickup_date' => date('Y-m-d', strtotime($res->pickuptime)),
                    'return_date' => date('Y-m-d', strtotime($res->returntime)),
                ];
            });
        });

        // Kijk of we in "edit mode" zijn
        $editReservation = null;
        if ($request->has('edit')) {
            $editReservation = Reservation::where('id', $request->edit)
                ->where('user_id', Auth::id())
                ->first();
        }

        return Inertia::render('klant/product', [
            'tool' => $tool,
            'existingReservations' => $existingReservations,
            'editReservation' => $editReservation ? [
                'id' => $editReservation->id,
                'pickup_date' => date('Y-m-d', strtotime($editReservation->pickuptime)),
                'return_date' => date('Y-m-d', strtotime($editReservation->returntime)),
            ] : null
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
                $query->whereIn('status', ['gereserveerd', 'uitgegeven'])
                      ->where(function ($q) use ($start, $end) {
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

    public function update(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) abort(403);

        $maxDate = now()->addDays(30)->format('Y-m-d');
        $request->validate([
            'pickupDate' => "required|date|after_or_equal:today|before_or_equal:$maxDate",
            'returnDate' => "required|date|after_or_equal:pickupDate|before_or_equal:$maxDate",
        ]);

        $start = $request->pickupDate . ' 00:00:00';
        $end = $request->returnDate . ' 23:59:59';

        $availableBarcode = Barcode::where('tool_id', $reservation->barcode->tool_id)
            ->whereDoesntHave('reservation', function ($query) use ($start, $end, $reservation) {
                $query->whereIn('status', ['gereserveerd', 'uitgegeven'])
                      ->where('id', '!=', $reservation->id)
                      ->where(function ($q) use ($start, $end) {
                          $q->where('pickuptime', '<=', $end)
                            ->where('returntime', '>=', $start);
                      });
            })
            ->first();

        if (!$availableBarcode) {
            return back()->withErrors(['error' => 'Helaas, voor deze nieuwe periode zijn geen exemplaren beschikbaar.']);
        }

        $reservation->update([
            'barcode_id' => $availableBarcode->id,
            'pickuptime' => $start,
            'returntime' => $end,
        ]);

        return redirect()->route('reservering.reserveringen')
        ->with('success', 'Reservering succesvol gewijzigd!');
    }

    public function reserveringen()
    {
        $now = Carbon::now();

        $allReservations = Reservation::where('user_id', Auth::id())
            ->with(['barcode.tool.price'])
            ->get();

        $upcoming = $allReservations->filter(function ($res) use ($now) {
            $pickuptime = Carbon::parse($res->pickuptime);
            return strtolower($res->status) !== 'geannuleerd' && $pickuptime->gt($now);
        })->sortBy('pickuptime');

        $past = $allReservations->filter(function ($res) use ($now) {
            $pickuptime = Carbon::parse($res->pickuptime);
            return strtolower($res->status) !== 'geannuleerd' && $pickuptime->lte($now);
        })->sortByDesc('pickuptime');

        $cancelled = $allReservations->filter(function ($res) {
            return strtolower($res->status) === 'geannuleerd';
        })->sortByDesc('pickuptime');

        $reserveringen = $upcoming->concat($past)->concat($cancelled)->map(function ($res) {
            $start = Carbon::parse($res->pickuptime);
            $end = Carbon::parse($res->returntime);
            
            $days = $start->diffInDays($end) + 1;
            $priceRecord = $res->barcode->tool->price->sortByDesc('created_at')->first();
            $dayPrice = $priceRecord->dayprice ?? 0;

            return [
                'id' => $res->id,
                'tool_id' => $res->barcode->tool_id, // Toegevoegd voor de link
                'productnaam' => $res->barcode->tool->name,
                'periode' => $start->format('d-m-Y') . ' t/m ' . $end->format('d-m-Y'),
                'totaalprijs' => '€ ' . number_format($days * $dayPrice, 2, ',', '.'),
                'status' => ucfirst($res->status),
                'raw_pickup_date' => $res->pickuptime,
            ];
        })->values();

        return Inertia::render('klant/reserveringen', [
            'reserveringen' => $reserveringen
        ]);
    }

    public function cancel(Reservation $reservation)
    {
        if ($reservation->user_id !== auth()->id()) {
            abort(403);
        }

        $pickupDate = Carbon::parse($reservation->pickuptime)->startOfDay();
        $now = Carbon::now();

        if ($now->greaterThanOrEqualTo($pickupDate->copy()->subDay())) {
            return back()->withErrors(['error' => 'Annuleren kan tot maximaal 1 dag voor de startdatum.']);
        }

        $reservation->update(['status' => 'geannuleerd']);

        if ($reservation->barcode->status === 'verhuurd') {
            $reservation->barcode->update(['status' => 'beschikbaar']);
        }

        return back()->with('success', 'Reservering is succesvol geannuleerd.');
    }
}