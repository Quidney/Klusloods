<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Barcode;
use App\Models\Retour;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    public function indexReturn()
    {
        $reservations = Reservation::with(['user', 'barcode.tool'])->where('status', 'uitgegeven')->get();
        return Inertia::render('employee/RegisterReturn', [
            'reservations' => $reservations
        ]);
    }

    public function indexMaintenance()
    {
        $barcodes = Barcode::all();
        $maintenances = Maintenance::with('barcode')->get();
        return Inertia::render('employee/RegisterMaintenance', [
            'barcodes' => $barcodes,
            'maintenances' => $maintenances,
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
}
