<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Enums\ReservationStatus;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class StatController extends Controller
{
    public function index(Request $req)
    {
        if (isset($req->month))
            $month = Carbon::parse($req->month)->Format('m');
        else
            $month = strtolower(Carbon::now()->Format('m'));
        if (isset($req->year))
            $year = (int)$req->year;
        else
            $year = Carbon::now()->Format('Y');

        $rents = Reservation::with(['barcode.tool.price', 'retour'])
            ->whereYear('pickuptime', $year)
            ->where('status', ReservationStatus::GERESERVEERD)
            ->get();

        $invoices = Invoice::with(['payments'])
            ->whereYear('created_at', $year)
            ->get();

        $rents->each(function ($rent) {
            $tool = $rent->barcode->tool;
            $rent->resolvedprices = $tool->price
                ->where('created_at', '<=', $rent->created_at)
                ->sortByDesc('created_at')
                ->first();

            if (isset($rent->retour->actualreturntime))
                $returntime = $rent->retour->actualreturntime;
            else
                $returntime = $rent->returntime;

            $difInDays = Carbon::parse(Carbon::parse($rent->pickuptime)->format('Y-m-d'))->diff(Carbon::parse(Carbon::parse($returntime)->format('Y-m-d')))->d;

            $price = 0;

            if ($difInDays >= 7) {
                $price += ($difInDays / 7) * $rent->resolvedprices->weekprice;
                $price += ($difInDays % 7) * $rent->resolvedprices->dayprice;
            } else $price += $difInDays * $rent->resolvedprices->dayprice;

            $rent->profit = $price;
        });
        $maintenance = Maintenance::whereYear('date', $year)
            ->get();

        $topProducts = Reservation::select( 'tools.*', DB::raw('COUNT(*) as aggerator'))
            ->join('barcodes', 'reservations.barcode_id', '=', 'barcodes.id')
            ->join('tools', 'barcodes.tool_id', '=', 'tools.id')
            ->whereYear('pickuptime', $year)
            ->whereMonth('pickuptime', $month)
            ->where('reservations.status', ReservationStatus::GERESERVEERD)
            ->groupBy('barcodes.tool_id')
            ->orderByDesc('aggerator')
            ->limit(10)
            ->get();

        $years=Reservation::selectRaw('year(pickuptime) as y')->groupBy('y')->get();
        $months=Reservation::selectRaw('month(pickuptime) as m')->groupBy('m')->get();
        return Inertia::render('admin/stats', [
            'rents' => $rents,
            'maintenance' => $maintenance,
            'invoices' => $invoices,
            'topProducts' => $topProducts,
            'years' => $years,
            'months' => $months
        ]);
    }
}
