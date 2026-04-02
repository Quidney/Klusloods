<?php

namespace App\Http\Controllers;

use App\Services\OpeningHoursService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OpeninghourController extends Controller
{
    public function __construct(private readonly OpeningHoursService $openingHoursService)
    {
    }

    public function index()
    {
        return Inertia::render('admin/openinghours', [
            'openinghours' => $this->openingHoursService->allOrdered()->map(fn ($openingHour) => [
                'id' => $openingHour->id,
                'day' => $openingHour->day,
                'startime' => $openingHour->startime,
                'endtime' => $openingHour->endtime,
                'status' => $openingHour->status,
            ]),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'openinghours' => ['required', 'array', 'size:7'],
            'openinghours.*.id' => ['required', 'integer', 'exists:openinghours,id'],
            'openinghours.*.day' => ['required', Rule::in(['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'])],
            'openinghours.*.status' => ['required', Rule::in(['open', 'gesloten'])],
            'openinghours.*.startime' => ['nullable', 'date_format:H:i'],
            'openinghours.*.endtime' => ['nullable', 'date_format:H:i'],
        ]);

        foreach ($validated['openinghours'] as $openingHourData) {
            $startime = $openingHourData['status'] === 'open' ? $openingHourData['startime'] : null;
            $endtime = $openingHourData['status'] === 'open' ? $openingHourData['endtime'] : null;

            if ($openingHourData['status'] === 'open' && (! $startime || ! $endtime || $startime >= $endtime)) {
                return back()
                    ->withErrors(['openinghours' => 'Voor een open dag moeten begin- en eindtijd geldig zijn en moet de eindtijd later zijn dan de begintijd.'])
                    ->withInput();
            }

            \App\Models\Openinghour::query()
                ->whereKey($openingHourData['id'])
                ->update([
                    'day' => $openingHourData['day'],
                    'status' => $openingHourData['status'],
                    'startime' => $startime ? $startime . ':00' : null,
                    'endtime' => $endtime ? $endtime . ':00' : null,
                ]);
        }

        return back()->with('success', 'Openingstijden zijn bijgewerkt.');
    }
}
