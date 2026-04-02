<?php

namespace Database\Seeders;

use App\Models\Barcode;
use App\Models\Reservation;
use App\Models\User;
use App\Services\InvoiceService;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $invoiceService = app(InvoiceService::class);

        $users = User::query()->orderBy('id')->get();
        $barcodeIds = Barcode::query()->orderBy('id')->pluck('id')->values();

        if ($users->isEmpty() || $barcodeIds->isEmpty()) {
            return;
        }

        foreach ($users as $index => $user) {
            $reservation = Reservation::query()
                ->where('user_id', $user->id)
                ->where('status', '!=', 'geannuleerd')
                ->orderByDesc('id')
                ->first();

            if (! $reservation) {
                $pickupDate = now()->subDays(10 + $index)->startOfDay();
                $returnDate = now()->subDays(7 + $index)->endOfDay();

                $reservation = Reservation::create([
                    'user_id' => $user->id,
                    'barcode_id' => $barcodeIds[$index % $barcodeIds->count()],
                    'pickuptime' => $pickupDate,
                    'returntime' => $returnDate,
                    'status' => 'afgerond',
                ]);
            }

            if ($reservation->status !== 'afgerond') {
                $reservation->status = 'afgerond';
                $reservation->save();
            }

            $invoiceService->generateForReservation($reservation);
        }
    }
}
