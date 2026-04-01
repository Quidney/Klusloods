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
        $tool = Tool::with(['category', 'barcode', 'price'])->findOrFail($id);

        $tool->stockCount = $tool->barcode->where('status', 'beschikbaar')->count();

        $price = $tool->price->sortByDesc('created_at')->last();

        $tool->detailed_price = [
            'day' => $price->dayprice ?? 0,
            'week' => $price->weekprice ?? 0,
            'deposit' => $price->deposit ?? 0,
        ];
        return Inertia::render('klant/product', [
            'tool' => $tool
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tool_id' => 'required|exists:tools,id',
            'pickupDate' => 'required|date|after_or_equal:today',
            'returnDate' => 'required|date|after_or_equal:pickupDate',
        ]);

        $barcode = Barcode::where('tool_id', $request->tool_id)
            ->where('status', 'beschikbaar')
            ->first();

        if (!$barcode) {
            return back()->withErrors(['error' => 'Geen voorraad beschikbaar']);
        }

        $reservation = new Reservation();
        $reservation->user_id = Auth::id();
        $reservation->barcode_id = $barcode->id;
        $reservation->pickuptime = $request->pickupDate . ' 00:00:00';
        $reservation->returntime = $request->returnDate . ' 00:00:00';
        $reservation->status = 'gereserveerd';
        $reservation->save();

        $barcode->status = 'verhuurd';
        $barcode->save();

        return back()->with('success', 'Reservering geplaatst!');
    }
}