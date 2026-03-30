<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Barcode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::with(['user', 'barcode.tool'])->get();

        return Inertia::render('employee/RegisterIssue', [
            'reservations' => $reservations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        if ($reservation->status === 'geannuleerd') {
            return response()->json(['message' => 'Reservering geannuleerd'], 400);
        }

        $reservation->update([
            'barcode_id' => $request->barcode_id,

            'status' => 'uitgegeven',
        ]);


        $barcode = Barcode::find($request->barcode_id);
        if ($barcode) {
            $barcode->status = 'verhuurd';
            $barcode->notes = trim(
                ($request->condition ?? '') .
                    ($request->condition && $request->accessories ? ' | ' : '') .
                    ($request->accessories ?? '')
            );
            $barcode->save();
        }

        return response()->json(['message' => 'Succesvol uitgegeven', 'reservation' => $reservation]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
