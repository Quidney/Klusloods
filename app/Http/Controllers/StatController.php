<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Enums\ReservationStatus;
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

        $rents = Reservation::with( ['barcode.tool.price','retour'])
            ->whereMonth( 'pickuptime', $month)
            ->whereYear('pickuptime', $year)
            ->where('status', ReservationStatus::GERESERVEERD)
            ->get();
        
        $rents->each(function($rent) {
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
        $maintenance = Maintenance::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();
        
        
        return Inertia::render('admin/stats',[
            'rents'=>$rents,
            'maintenance'=>$maintenance
        ]);
    }
}
