<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Barcode;
use App\Models\Retour;
use App\Models\Maintenance;
use App\Services\OpeningHoursService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function __construct(private readonly OpeningHoursService $openingHoursService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function indexIssue()
    {
        $reservations = Reservation::with(['user', 'barcode.tool'])->get();

        return Inertia::render('employee/RegisterIssue', [
            'reservations' => $reservations,
            'openingHours' => $this->openingHoursService->allOrdered()->map(fn ($openingHour) => [
                'day' => $openingHour->day,
                'startime' => $openingHour->startime,
                'endtime' => $openingHour->endtime,
                'status' => $openingHour->status,
            ]),
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
            'reservations' => $reservations,
            'openingHours' => $this->openingHoursService->allOrdered()->map(fn ($openingHour) => [
                'day' => $openingHour->day,
                'startime' => $openingHour->startime,
                'endtime' => $openingHour->endtime,
                'status' => $openingHour->status,
            ]),
        ]);
    }

    public function indexMaintenance()
    {
        $barcodes = Barcode::all();

        $maintenances = Maintenance::with('barcode')->get();
        return Inertia::render('employee/RegisterMaintenance', [
            'initialBarcodes' => $barcodes,
            'initialMaintenances' => $maintenances,
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

    public function saveMaintenance(Request $request)
    {
        $request->validate([
            'barcode_id' => 'required|exists:barcodes,id',
            'maintenance_date' => 'required|date',
            'description' => 'required|string',
            'cost' => 'nullable|numeric',
            'status' => 'required|string'
        ]);

        $maintenance = Maintenance::create([
            'barcode_id' => $request->barcode_id,
            'date' => $request->maintenance_date,
            'description' => $request->description,
            'status' => $request->status,
            'cost' => $request->cost,
        ]);
        $barcode = $maintenance->barcode;
        if ($barcode) {
            $barcode->status = 'onderhoud';
            $barcode->save();
        }

        return response()->json([
        'maintenance' => $maintenance,
        'message' => 'Onderhoud aangemaakt'
    ]);
    }

    public function completeMaintenance($id)
    {
        $maintenance = Maintenance::findOrFail($id);
        $maintenance->status = 'afgerond';
        $maintenance->save();

        $barcode = $maintenance->barcode;
        if ($barcode && $barcode->status !== 'afgeschreven') {
            $barcode->status = 'beschikbaar';
            $barcode->save();
        }

         return response()->json([
        'maintenance' => $maintenance,
        'message' => 'Onderhoud afgerond'
    ]);
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
        if (! $this->openingHoursService->isWithin(now())) {
            return response()->json(['message' => 'Uitgifte kan alleen binnen openingstijden geregistreerd worden.'], 422);
        }

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
        $request->validate([
            'return_date' => 'required|date',
            'status' => 'required|string',
            'description' => 'nullable|string',
            'damage_cost' => 'nullable|numeric|min:0',
        ]);

        if (! $this->openingHoursService->isWithin(now())) {
            return response()->json(['message' => 'Retour kan alleen binnen openingstijden geregistreerd worden.'], 422);
        }

        if (! $this->openingHoursService->isWithin(Carbon::parse($request->return_date))) {
            return response()->json(['message' => 'De opgegeven retourtijd valt buiten openingstijden.'], 422);
        }

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
