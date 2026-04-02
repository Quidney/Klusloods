<?php

namespace App\Services;

use App\Models\Openinghour;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class OpeningHoursService
{
    private const DAYS = [
        1 => 'maandag',
        2 => 'dinsdag',
        3 => 'woensdag',
        4 => 'donderdag',
        5 => 'vrijdag',
        6 => 'zaterdag',
        7 => 'zondag',
    ];

    public function allOrdered(): Collection
    {
        $order = "FIELD(day, 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag')";

        return Openinghour::query()
            ->orderByRaw($order)
            ->get();
    }

    public function isWithin(Carbon $dateTime): bool
    {
        $day = self::DAYS[$dateTime->dayOfWeekIso] ?? null;

        if ($day === null) {
            return false;
        }

        $openingHour = Openinghour::query()
            ->where('day', $day)
            ->first();

        if (! $openingHour || $openingHour->status !== 'open' || ! $openingHour->startime || ! $openingHour->endtime) {
            return false;
        }

        $time = $dateTime->format('H:i:s');

        return $time >= $openingHour->startime && $time <= $openingHour->endtime;
    }
}
