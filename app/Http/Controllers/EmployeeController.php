<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Barcode;
use App\Models\Retour;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexIssue()
    {
        $reservations = Reservation::with(['user', 'barcode.tool'])->get();

        return Inertia::render('employee/RegisterIssue', [
            'reservations' => $reservations
        ]);
    }

    public function indexExtended()
    {
        $reservations = Reservation::with(['user', 'barcode.tool.price'])->where('status', 'uitgegeven')->get();
        return Inertia::render('employee/ExtensionRequest', [
            'reservations' => $reservations
        ]);
    }
    public function indexReturn()
    {
        $reservations = Reservation::with(['user', 'barcode.tool'])->where('status', 'uitgegeven')->get();
        return Inertia::render('employee/RegisterReturn', [
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
    public function updateIssue(Request $request, Reservation $reservation)
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

    public function updateReturn(Request $request, Reservation $reservation)
    {
        $retour = new Retour();
        $retour->reservation_id = $reservation->id;
        $retour->actualreturntime = $request->return_date;
        $retour->status = $request->status;
        $retour->notes = $request->description;
        $retour->cost = $request->damage_cost;
        $retour->save();

        $reservation->update([
            'status' => 'afgerond'
        ]);

        $barcode = $reservation->barcode;
        if ($barcode) {
            $barcode->update([
                'status' => $retour->status === 'in orde' ? 'beschikbaar' : 'onderhoud'
            ]);
        }

        return response()->json(['message' => 'Succesvol retour geregistreerd', 'retour' => $retour]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function extendReservation(Request $request, Reservation $reservation)
    {
        $request->validate([
            'new_returntime' => 'required|date|after:' . $reservation->returntime,
        ]);

        $currentEnd = $reservation->returntime;
        $newEnd = $request->new_returntime;

        $overlap = Reservation::where('barcode_id', $reservation->barcode_id)
            ->where('status', '!=', 'afgerond')
            ->where('id', '!=', $reservation->id)
            ->where(function ($q) use ($currentEnd, $newEnd) {
                $q->where('pickuptime', '<', $newEnd)
                    ->where('returntime', '>', $currentEnd);
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'Verlengen niet mogelijk: conflict met andere reservering'], 422);
        }

        $reservation->update([
            'returntime' => $request->new_returntime
        ]);


        $reservation->load(['user', 'barcode.tool.price']);

        return response()->json([
            'message' => 'Reservering verlengd', 'reservation' => $reservation]);
    }
}
